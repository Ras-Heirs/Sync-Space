const UserService = require('../services/user.service');

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await UserService.register({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { email, name, image } = req.body;
      const result = await UserService.upsertGoogleUser({ email, name, image });

      res.status(200).json({
        success: true,
        message: 'Google login successful',
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

