const { asyncHandler } = require('../middleware/errorHandler');
const customerService = require('../services/customer.service');

const getCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.getCustomers(req.user._id, req.query);
  res.json({ success: true, ...result });
});

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.user._id, req.body);
  res.status(201).json({ success: true, data: customer });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.user._id, req.params.id);
  res.json({ success: true, data: customer });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.user._id, req.params.id);
  res.json({ success: true, message: 'Customer deleted' });
});

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
