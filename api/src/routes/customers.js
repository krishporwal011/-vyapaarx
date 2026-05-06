const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const validate = require('../middleware/validate');
const {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomersSchema,
  getCustomerByIdSchema,
  deleteCustomerSchema,
} = require('../validations/customer.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/customers
router.get('/', validate(getCustomersSchema), customerController.getCustomers);

// @POST /api/customers
router.post('/', validate(createCustomerSchema), customerController.createCustomer);

// @GET /api/customers/:id
router.get('/:id', validate(getCustomerByIdSchema), customerController.getCustomerById);

// @PUT /api/customers/:id
router.put('/:id', validate(updateCustomerSchema), customerController.updateCustomer);

// @DELETE /api/customers/:id
router.delete('/:id', validate(deleteCustomerSchema), customerController.deleteCustomer);

module.exports = router;
