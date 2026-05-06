const { z } = require('zod');

const createSupplierSchema = z.object({
  body: z.object({
    supplierCode: z.string().min(2, 'Supplier code is required'),
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address').optional().nullable(),
    phone: z.string().optional().nullable(),
    gstNumber: z.string().optional().nullable(),
    panNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable().default('India'),
    pincode: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

const updateSupplierSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    supplierCode: z.string().min(2).optional(),
    name: z.string().min(2).optional(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    gstNumber: z.string().optional().nullable(),
    panNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

const getSuppliersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 20)),
    search: z.string().optional(),
    status: z.string().optional(),
    sortField: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

const getSupplierByIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

const deleteSupplierSchema = z.object({
  params: z.object({ id: z.string() }),
});

module.exports = {
  createSupplierSchema,
  updateSupplierSchema,
  getSuppliersSchema,
  getSupplierByIdSchema,
  deleteSupplierSchema,
};
