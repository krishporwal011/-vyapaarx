const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getProducts = async (userId, queryOptions) => {
  const page = parseInt(queryOptions.page) || 1;
  const limit = parseInt(queryOptions.limit) || 20;
  const { search, category, lowStock } = queryOptions;
  
  const where = { userId };
  
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  
  if (category) {
    where.category = category;
  }
  
  // Custom logic for low stock comparison in Prisma since we can't do $expr directly in standard queries easily without raw queries, 
  // but we can query records and filter if needed, OR we can just use raw SQL if strictly required. 
  // However, for typical queries, this is often handled differently. Let's do a basic where if stock <= lowStockThreshold.
  // Actually, Prisma doesn't natively support comparing two columns in a `where` clause easily without raw SQL.
  // We'll fetch and filter if lowStock is true for now, or just leave it for the application layer if data is small.
  // For production, a raw query is better. Let's write a safe raw query fallback if lowStock is enabled.

  const skip = (page - 1) * limit;

  let products = [];
  let total = 0;

  if (lowStock === 'true') {
    // We can just query everything for the user and filter, since small SaaS.
    // In large scale, use: prisma.$queryRaw`SELECT * FROM Product WHERE stock <= lowStockThreshold AND userId = ${userId}`
    const allUserProducts = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
    const lowStockProducts = allUserProducts.filter(p => p.stock <= p.lowStockThreshold);
    total = lowStockProducts.length;
    products = lowStockProducts.slice(skip, skip + limit);
  } else {
    total = await prisma.product.count({ where });
    products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }

  return { data: products, total, page, pages: Math.ceil(total / limit) };
};

const createProduct = async (userId, productData) => {
  return await prisma.product.create({
    data: {
      ...productData,
      userId,
    }
  });
};

const getProductById = async (userId, productId) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, userId }
  });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const updateProduct = async (userId, productId, updateData) => {
  const product = await prisma.product.findFirst({ where: { id: productId, userId } });
  if (!product) throw new AppError('Product not found', 404);

  return await prisma.product.update({
    where: { id: productId },
    data: updateData
  });
};

const deleteProduct = async (userId, productId) => {
  const product = await prisma.product.findFirst({ where: { id: productId, userId } });
  if (!product) throw new AppError('Product not found', 404);

  return await prisma.product.delete({
    where: { id: productId }
  });
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
