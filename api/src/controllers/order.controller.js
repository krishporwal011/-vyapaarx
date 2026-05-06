const { asyncHandler } = require('../middleware/errorHandler');
const orderService = require('../services/order.service');

const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(req.user._id, req.query);
  res.json({ success: true, ...result });
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(201).json({ success: true, data: order });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user._id, req.params.id);
  res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.user._id, req.params.id, req.body.status);
  res.json({ success: true, data: order });
});

module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
};
