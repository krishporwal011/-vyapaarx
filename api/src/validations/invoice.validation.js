const { z } = require('zod');

const createInvoiceSchema = z.object({
  body: z.object({
    customerId: z.string({ required_error: 'Customer ID is required' }),
    supplierId: z.string().optional().nullable(),
    paymentStatus: z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional().default('UNPAID'),
    paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD']).optional().nullable(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional().default('draft'),
    dueDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    items: z.array(
      z.object({
        productId: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
        price: z.number().positive('Price must be positive'),
        discount: z.number().nonnegative().optional().default(0),
        gstRate: z.number().nonnegative().optional().default(18),
        hsnCode: z.string().optional().nullable(),
      })
    ).nonempty('At least one line item is required'),
  }),
});

const updateInvoiceSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    customerId: z.string().optional(),
    supplierId: z.string().optional().nullable(),
    paymentStatus: z.enum(['PAID', 'UNPAID', 'PARTIAL']).optional(),
    paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD']).optional().nullable(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
    dueDate: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
        discount: z.number().nonnegative().optional().default(0),
        gstRate: z.number().nonnegative().optional().default(18),
        hsnCode: z.string().optional().nullable(),
      })
    ).optional(),
  }),
});

const getInvoicesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    customerId: z.string().optional(),
    search: z.string().optional(),
  }),
});

const getInvoiceByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  getInvoicesSchema,
  getInvoiceByIdSchema,
};
