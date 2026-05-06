const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const validate = require('../middleware/validate');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getInvoiceByIdSchema,
} = require('../validations/invoice.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/invoices/analytics
router.get('/analytics', invoiceController.getInvoiceAnalytics);

// @GET /api/invoices
router.get('/', validate(getInvoicesSchema), invoiceController.getInvoices);

// @POST /api/invoices
router.post('/', validate(createInvoiceSchema), invoiceController.createInvoice);

// @GET /api/invoices/:id
router.get('/:id', validate(getInvoiceByIdSchema), invoiceController.getInvoiceById);

// @PUT /api/invoices/:id
router.put('/:id', validate(updateInvoiceSchema), invoiceController.updateInvoice);

// @DELETE /api/invoices/:id
router.delete('/:id', validate(getInvoiceByIdSchema), invoiceController.deleteInvoice);

module.exports = router;
