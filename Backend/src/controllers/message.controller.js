const MessageService = require('../services/message.service');

class MessageController {
  async getMessages(req, res, next) {
    try {
      const { roomId } = req.params;
      const messages = await MessageService.getMessagesByRoomId(roomId);
      res.status(200).json({
        success: true,
        payload: messages
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { roomId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // From authMiddleware

      const message = await MessageService.createMessage(roomId, userId, content);
      res.status(201).json({
        success: true,
        payload: message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
