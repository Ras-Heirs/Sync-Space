const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const { validate, schemas } = require('../middleware/validator');

router.get('/', optionalAuth, roomController.getAllRooms);

router.post('/', authMiddleware, validate(schemas.createRoom), roomController.createRoom);

router.get('/:id', roomController.getRoomById);

router.delete('/:id', authMiddleware, roomController.deleteRoom);

module.exports = router;
