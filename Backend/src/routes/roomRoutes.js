const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', roomController.getAllRooms);

router.post('/', authMiddleware, roomController.createRoom);

router.get('/:id', roomController.getRoomById);

module.exports = router;
