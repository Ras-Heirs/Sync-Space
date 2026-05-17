const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:roomId', authMiddleware, MessageController.getMessages);
router.post('/:roomId', authMiddleware, MessageController.sendMessage);

module.exports = router;
