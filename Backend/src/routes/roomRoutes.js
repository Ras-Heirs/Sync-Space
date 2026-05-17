const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);

// Protected routes
router.use(authMiddleware);

router.post('/', validate(schemas.createRoom), roomController.createRoom);
router.get('/suggested', roomController.getSuggestedRooms);

module.exports = router;
