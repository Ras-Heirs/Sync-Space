const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participant.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/join', participantController.joinRoom);
router.delete('/leave/:roomId', participantController.leaveRoom);
router.patch('/:participantId/status', participantController.updateStatus);
router.get('/room/:roomId', participantController.getParticipants);

module.exports = router;
