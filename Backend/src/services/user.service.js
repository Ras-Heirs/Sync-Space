const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  async getUserById(id) {
    const result = await db.query('SELECT id, name, email, image, domicile as domisili, hobbies, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async updateProfile(id, profileData) {
    const { name, domisili, hobbies, image } = profileData;
    const result = await db.query(
      `UPDATE users 
       SET name = $1, domicile = $2, hobbies = $3, image = $4 
       WHERE id = $5 
       RETURNING id, name, email, image, domicile as domisili, hobbies, created_at`,
      [name, domisili, hobbies, image, id]
    );
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];
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
