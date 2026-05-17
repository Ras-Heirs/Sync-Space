const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const { transactionCreationValidation, transactionIdValidation, validate } = require('../utils/validators');
const authMiddleware = require('../middleware/authMiddleware');

// No authentication, but validation added
router.post('/create', authMiddleware, transactionCreationValidation, validate, TransactionController.createTransaction);
router.get('/:id', transactionIdValidation, validate, TransactionController.getTransactionById);
router.post('/pay/:id', authMiddleware, transactionIdValidation, validate, TransactionController.payTransaction);
router.delete('/:id', authMiddleware, transactionIdValidation, validate, TransactionController.deleteTransaction);

module.exports = router;