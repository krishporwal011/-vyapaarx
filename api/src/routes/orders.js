const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const validate = require('../middleware/validate');
const {
  createOrderSchema,
  getOrdersSchema,
  getOrderByIdSchema,
  updateOrderStatusSchema,
} = require('../validations/order.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/orders
router.get('/', validate(getOrdersSchema), orderController.getOrders);

// @POST /api/orders
router.post('/', validate(createOrderSchema), orderController.createOrder);

// @GET /api/orders/:id
router.get('/:id', validate(getOrderByIdSchema), orderController.getOrderById);

// @PATCH /api/orders/:id/status
router.patch('/:id/status', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

module.exports = router;
