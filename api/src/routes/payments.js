const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(paymentController.getTransactionsList)
  .post(paymentController.createTransactionRecord);

router.route('/:id')
  .patch(paymentController.updateTransactionRecord);

module.exports = router;
