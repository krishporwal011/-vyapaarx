const { z } = require('zod');

const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    type: z.enum(['retail', 'wholesale', 'distributor']).optional().default('retail'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    gstin: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateCustomerSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    type: z.enum(['retail', 'wholesale', 'distributor']).optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    gstin: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

const getCustomersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
    search: z.string().optional(),
    type: z.string().optional(),
  }),
});

const getCustomerByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

const deleteCustomerSchema = z.object({
  params: z.object({ id: z.string() }),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomersSchema,
  getCustomerByIdSchema,
  deleteCustomerSchema,
};
