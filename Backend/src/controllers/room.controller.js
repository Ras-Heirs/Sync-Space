const roomService = require('../services/room.service');

exports.getAllRooms = async (req, res, next) => {
  try {
    const filters = req.query;
    const rooms = await roomService.getAllRooms(filters);

    res.status(200).json({
      success: true,
      message: 'Rooms fetched successfully',
      payload: rooms
    });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { categoryId, categoryName, title, description, region, maxCapacity, isPrivate, activityDetails } = req.body;
    const masterId = req.user.id;

    const newRoom = await roomService.createRoom({
      masterId,
      categoryId,
      categoryName,
      title,
      description,
      region,
      maxCapacity,
      isPrivate,
      activityDetails
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      payload: newRoom
    });
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
        payload: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room details fetched successfully',
      payload: room
    });
  } catch (error) {
    next(error);
  }
};
