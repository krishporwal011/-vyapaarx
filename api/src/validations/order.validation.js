const { z } = require('zod');

const orderItemSchema = z.object({
  product: z.string(),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  tax: z.number().nonnegative('Tax cannot be negative').optional().default(0),
});

const createOrderSchema = z.object({
  body: z.object({
    customer: z.string(),
    items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
    totalAmount: z.number().nonnegative(),
    taxAmount: z.number().nonnegative().optional().default(0),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional().default('pending'),
    paymentStatus: z.enum(['unpaid', 'partial', 'paid']).optional().default('unpaid'),
  }),
});

const getOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
  }),
});

const getOrderByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  }),
});

module.exports = {
  createOrderSchema,
  getOrdersSchema,
  getOrderByIdSchema,
  updateOrderStatusSchema,
};
