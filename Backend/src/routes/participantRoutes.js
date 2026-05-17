const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participant.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', participantController.joinRoom);

router.patch('/:id', participantController.updateStatus);

router.get('/room/:roomId', participantController.getRoomParticipants);

module.exports = router;
