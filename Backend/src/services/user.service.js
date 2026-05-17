const { db } = require('../database/drizzle');
const { users } = require('../models/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  async getUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (user) {
      delete user.password;
    }
    return user;
  }

  async updateProfile(id, profileData) {
    const { name, domicile, hobbies, image } = profileData;
    const [updatedUser] = await db.update(users)
      .set({ name, domicile, hobbies, image })
      .where(eq(users.id, id))
      .returning();
    
    if (updatedUser) {
      delete updatedUser.password;
    }
    return updatedUser;
  }

  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    const token = this.generateToken(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
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

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  async upsertGoogleUser(userData) {
    const { email, name, image } = userData;
    
    let user = await this.getUserByEmail(email);
    
    if (user) {
      // Update existing user image if it changed
      const [updatedUser] = await db.update(users)
        .set({ name, image })
        .where(eq(users.email, email))
        .returning();
      user = updatedUser;
    } else {
      // Create new user
      const [newUser] = await db.insert(users).values({
        name,
        email,
        image,
      }).returning();
      user = newUser;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '1d' }
    );
  }
}

module.exports = new UserService();
