const userService = require('../services/user.service');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, domisili, hobbies, image } = req.body;
      const updatedUser = await userService.updateProfile(req.user.id, {
        name,
        domisili,
        hobbies,
        image
      });
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
