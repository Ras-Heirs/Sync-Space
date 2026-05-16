const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/item.controller');
const { itemValidation, validate } = require('../utils/validators');

// Public routes
router.get('/', ItemController.getAllItems);
router.get('/:id', ItemController.getItemById);
router.post('/', itemValidation, validate, ItemController.createItem);
router.put('/:id', itemValidation, validate, ItemController.updateItem);

module.exports = router;