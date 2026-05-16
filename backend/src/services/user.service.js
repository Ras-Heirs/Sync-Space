const { db } = require('../database/drizzle');
const { users } = require('../models/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  async getUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateProfile(id, profileData) {
    const [updatedUser] = await db.update(users)
      .set({
        name: profileData.name,
        domicile: profileData.domicile,
        hobbies: profileData.hobbies,
        image: profileData.image,
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async register(userData) {
    const { name, email, password } = userData;
    
    // Check if user exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Generate token
    const token = this.generateToken(newUser);

    return { user: newUser, token };
  }

  async login(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );
  }
}

module.exports = new UserService();
