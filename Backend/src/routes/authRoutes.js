const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validate, schemas } = require('../middleware/validator');

router.post('/login', validate(schemas.login), AuthController.login);
router.post('/register', validate(schemas.register), AuthController.register);

module.exports = router;