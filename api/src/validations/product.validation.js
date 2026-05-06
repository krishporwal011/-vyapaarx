const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    sku: z.string().min(2, 'SKU is required'),
    category: z.string().min(2, 'Category is required'),
    price: z.number().positive('Price must be positive'),
    costPrice: z.number().positive('Cost price must be positive').optional(),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    lowStockThreshold: z.number().int().nonnegative().optional().default(10),
    description: z.string().optional(),
    gstRate: z.number().nonnegative().optional().default(18),
  }),
});

const updateProductSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    sku: z.string().min(2).optional(),
    category: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    costPrice: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    lowStockThreshold: z.number().int().nonnegative().optional(),
    description: z.string().optional(),
    gstRate: z.number().nonnegative().optional(),
  }),
});

const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
    search: z.string().optional(),
    category: z.string().optional(),
    lowStock: z.string().optional(),
  }),
});

const getProductByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

const deleteProductSchema = z.object({
  params: z.object({ id: z.string() }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  deleteProductSchema,
};
