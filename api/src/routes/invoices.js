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
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);

// @GET /api/invoices/analytics
router.get('/analytics', invoiceController.getInvoiceAnalytics);

// @GET /api/invoices
router.get('/', validate(getInvoicesSchema), invoiceController.getInvoices);

// @POST /api/invoices (Requires admin or accountant)
router.post('/', authorizeRoles('admin', 'accountant'), validate(createInvoiceSchema), invoiceController.createInvoice);

// @GET /api/invoices/:id
router.get('/:id', validate(getInvoiceByIdSchema), invoiceController.getInvoiceById);

// @PUT /api/invoices/:id (Requires admin or accountant)
router.put('/:id', authorizeRoles('admin', 'accountant'), validate(updateInvoiceSchema), invoiceController.updateInvoice);

// @GET /api/invoices/:id/pdf
router.get('/:id/pdf', validate(getInvoiceByIdSchema), invoiceController.downloadInvoicePDF);

// @DELETE /api/invoices/:id (Requires admin only)
router.delete('/:id', authorizeRoles('admin'), validate(getInvoiceByIdSchema), invoiceController.deleteInvoice);

module.exports = router;
