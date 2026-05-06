const { asyncHandler } = require('../middleware/errorHandler');
const invoiceService = require('../services/invoice.service');

const getInvoices = asyncHandler(async (req, res) => {
  const result = await invoiceService.getInvoices(req.user._id, req.query);
  res.json({ success: true, ...result });
});

const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.user._id, req.body);
  res.status(201).json({ success: true, data: invoice });
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.user._id, req.params.id);
  res.json({ success: true, data: invoice });
});

const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: invoice });
});

const deleteInvoice = asyncHandler(async (req, res) => {
  await invoiceService.deleteInvoice(req.user._id, req.params.id);
  res.json({ success: true, message: 'Invoice deleted successfully' });
});

const getInvoiceAnalytics = asyncHandler(async (req, res) => {
  const analytics = await invoiceService.getInvoiceAnalytics(req.user._id);
  res.json({ success: true, data: analytics });
});

module.exports = {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceAnalytics,
};
