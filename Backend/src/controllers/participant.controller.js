const participantService = require('../services/participant.service');

exports.joinRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    const result = await participantService.joinRoom(roomId, userId);

    res.status(201).json({
      success: true,
      message: result.status === 'PENDING' ? 'Join request sent' : 'Joined room successfully',
      payload: result
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const masterId = req.user.id;

    const result = await participantService.updateParticipantStatus(id, masterId, status);

    res.status(200).json({
      success: true,
      message: `Participant status updated to ${status}`,
      payload: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getRoomParticipants = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const participants = await participantService.getParticipants(roomId);

    res.status(200).json({
      success: true,
      payload: participants
    });
  } catch (error) {
    next(error);
  }
};
