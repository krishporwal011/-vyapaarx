const { asyncHandler } = require('../middleware/errorHandler');
const paymentService = require('../services/payment.service');

const getTransactionsList = asyncHandler(async (req, res) => {
  const transactions = await paymentService.getTransactions(req.user._id);
  res.json({ success: true, data: transactions });
});

const createTransactionRecord = asyncHandler(async (req, res) => {
  const transaction = await paymentService.createTransaction(req.user._id, req.body);
  res.status(201).json({ success: true, data: transaction });
});

const updateTransactionRecord = asyncHandler(async (req, res) => {
  const transaction = await paymentService.updateTransaction(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: transaction });
});

module.exports = {
  getTransactionsList,
  createTransactionRecord,
  updateTransactionRecord
};
