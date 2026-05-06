const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getSuppliers = async (userId, queryOptions) => {
  const { page = 1, limit = 20, search, status, sortField = 'createdAt', sortOrder = 'desc' } = queryOptions;

  const where = { userId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { supplierCode: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;
  const total = await prisma.supplier.count({ where });

  const suppliers = await prisma.supplier.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortField]: sortOrder },
  });

  return {
    data: suppliers,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const createSupplier = async (userId, supplierData) => {
  // Check if supplierCode is unique
  const existingSupplier = await prisma.supplier.findUnique({
    where: { supplierCode: supplierData.supplierCode },
  });

  if (existingSupplier) {
    throw new AppError('Supplier code already exists', 400);
  }

  return await prisma.supplier.create({
    data: {
      ...supplierData,
      userId,
    },
  });
};

const getSupplierById = async (userId, id) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, userId },
  });

  if (!supplier) {
    throw new AppError('Supplier not found', 404);
  }

  return supplier;
};

const updateSupplier = async (userId, id, updateData) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, userId },
  });

  if (!supplier) {
    throw new AppError('Supplier not found', 404);
  }

  if (updateData.supplierCode && updateData.supplierCode !== supplier.supplierCode) {
    const existing = await prisma.supplier.findUnique({
      where: { supplierCode: updateData.supplierCode },
    });
    if (existing) {
      throw new AppError('Supplier code already exists', 400);
    }
  }

  return await prisma.supplier.update({
    where: { id },
    data: updateData,
  });
};

const deleteSupplier = async (userId, id) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, userId },
  });

  if (!supplier) {
    throw new AppError('Supplier not found', 404);
  }

  return await prisma.supplier.delete({
    where: { id },
  });
};

const getSupplierAnalytics = async (userId) => {
  const total = await prisma.supplier.count({ where: { userId } });
  const active = await prisma.supplier.count({ where: { userId, status: 'ACTIVE' } });
  const inactive = await prisma.supplier.count({ where: { userId, status: 'INACTIVE' } });

  // Get monthly supplier registration stats for growth charts
  const suppliers = await prisma.supplier.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  const monthlyGrowth = {};
  suppliers.forEach((s) => {
    const date = new Date(s.createdAt);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g. "May 26"
    monthlyGrowth[monthYear] = (monthlyGrowth[monthYear] || 0) + 1;
  });

  const growthStats = Object.keys(monthlyGrowth).map((key) => ({
    month: key,
    count: monthlyGrowth[key],
  }));

  return {
    total,
    active,
    inactive,
    growthStats,
  };
};

module.exports = {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierAnalytics,
};
