const roomService = require('../services/room.service');

class RoomController {
  async createRoom(req, res, next) {
    try {
      const roomData = {
        ...req.body,
        masterId: req.user.id, // Assuming user is attached by authMiddleware
      };
      const room = await roomService.createRoom(roomData);
      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        payload: room,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRooms(req, res, next) {
    try {
      const filters = {
        region: req.query.region,
        categoryId: req.query.categoryId,
        status: req.query.status,
        search: req.query.search,
        isPrivate: req.query.isPrivate,
        minCapacity: req.query.minCapacity,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };
      const rooms = await roomService.getAllRooms(filters);
      res.status(200).json({
        success: true,
        payload: rooms,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomById(req, res, next) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found',
        });
      }
      res.status(200).json({
        success: true,
        payload: room,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuggestedRooms(req, res, next) {
    try {
      const { categoryId } = req.query;
      const rooms = await roomService.getSuggestedRooms(req.user, categoryId);
      res.status(200).json({
        success: true,
        payload: rooms,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoomController();
