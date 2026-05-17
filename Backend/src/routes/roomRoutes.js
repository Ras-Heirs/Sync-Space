const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

router.get('/', roomController.getAllRooms);

router.post('/', authMiddleware, validate(schemas.createRoom), roomController.createRoom);

router.get('/:id', roomController.getRoomById);

router.delete('/:id', authMiddleware, roomController.deleteRoom);

router.post('/:id/messages', authMiddleware, roomController.sendMessage);

module.exports = router;
