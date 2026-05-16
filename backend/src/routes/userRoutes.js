const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', validate(schemas.updateProfile), userController.updateProfile);

module.exports = router;
