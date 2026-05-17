const roomService = require('../services/room.service');
const userService = require('../services/user.service');
const pusher = require('../config/pusher');

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
    console.log(`Fetching room by ID: ${id}`);
    const room = await roomService.getRoomById(id);

    if (!room) {
      console.log(`Room with ID ${id} not found in database`);
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

exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`Attempting to delete room ${id} by user ${userId}`);
    await roomService.deleteRoom(id, userId);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      payload: { id }
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    // Ensure we have a name
    let senderName = req.user.name;
    if (!senderName) {
      const user = await userService.getUserById(req.user.id);
      senderName = user ? user.name : req.user.email;
    }

    await pusher.trigger(`room-${id}`, "message", {
      sender: senderName,
      text: message,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Message sent'
    });
  } catch (error) {
    next(error);
  }
};
