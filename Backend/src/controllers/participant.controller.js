const participantService = require('../services/participant.service');

class ParticipantController {
  async joinRoom(req, res, next) {
    try {
      const { roomId } = req.body;
      const participant = await participantService.joinRoom(roomId, req.user.id);
      res.status(201).json({
        success: true,
        message: participant.status === 'PENDING' ? 'Join request sent' : 'Joined room successfully',
        payload: participant,
      });
    } catch (error) {
      next(error);
    }
  }

  async leaveRoom(req, res, next) {
    try {
      const { roomId } = req.params;
      await participantService.leaveRoom(roomId, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Left room successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { participantId } = req.params;
      const { status } = req.body; // 'JOINED' or 'REJECTED'
      const updated = await participantService.updateParticipantStatus(participantId, req.user.id, status);
      res.status(200).json({
        success: true,
        message: `Participant request ${status.toLowerCase()}`,
        payload: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getParticipants(req, res, next) {
    try {
      const { roomId } = req.params;
      const participants = await participantService.getParticipants(roomId);
      res.status(200).json({
        success: true,
        payload: participants,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParticipantController();
