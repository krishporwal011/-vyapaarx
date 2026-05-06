const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const validate = require('../middleware/validate');
const {
  createSupplierSchema,
  updateSupplierSchema,
  getSuppliersSchema,
  getSupplierByIdSchema,
  deleteSupplierSchema,
} = require('../validations/supplier.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/suppliers/analytics
router.get('/analytics', supplierController.getSupplierAnalytics);

// @GET /api/suppliers
router.get('/', validate(getSuppliersSchema), supplierController.getSuppliers);

// @POST /api/suppliers
router.post('/', validate(createSupplierSchema), supplierController.createSupplier);

// @GET /api/suppliers/:id
router.get('/:id', validate(getSupplierByIdSchema), supplierController.getSupplierById);

// @PUT /api/suppliers/:id
router.put('/:id', validate(updateSupplierSchema), supplierController.updateSupplier);

// @DELETE /api/suppliers/:id
router.delete('/:id', validate(deleteSupplierSchema), supplierController.deleteSupplier);

module.exports = router;
