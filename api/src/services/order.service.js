const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getOrders = async (userId, queryOptions) => {
  const page = parseInt(queryOptions.page) || 1;
  const limit = parseInt(queryOptions.limit) || 20;
  const { status, paymentStatus } = queryOptions;
  
  const where = { userId };
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const skip = (page - 1) * limit;
  const total = await prisma.order.count({ where });
  
  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { data: orders, total, page, pages: Math.ceil(total / limit) };
};

const createOrder = async (userId, orderData) => {
  const { customer, items, totalAmount, taxAmount, status, paymentStatus } = orderData;
  
  const orderNumber = `VX-${Date.now().toString().slice(-8)}`;

  // Use a Prisma transaction to create the order and deduct stock synchronously
  return await prisma.$transaction(async (tx) => {
    // 1. Create the Order with nested OrderItems
    const order = await tx.order.create({
      data: {
        userId,
        customerId: customer,
        orderNumber,
        subtotal: totalAmount - taxAmount,
        total: totalAmount,
        gstAmount: taxAmount,
        status: status || 'pending',
        paymentStatus: paymentStatus || 'unpaid',
        items: {
          create: items.map(item => ({
            productId: item.product || item.productId,
            name: item.name || 'Item',
            quantity: item.quantity,
            price: item.price,
            gstRate: item.gstRate || (item.tax > 0 && item.price > 0 ? (item.tax / item.price) * 100 : 18),
            total: item.price * item.quantity + (item.tax || 0)
          }))
        }
      },
      include: {
        items: true
      }
    });

    // 2. Deduct stock for each item
    for (const item of items) {
      await tx.product.update({
        where: { id: item.product },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return order;
  });
};

const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            select: { id: true, name: true, sku: true }
          }
        }
      }
    }
  });
    
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const updateOrderStatus = async (userId, orderId, status) => {
  const orderExists = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!orderExists) throw new AppError('Order not found', 404);

  const updatePayload = { status };
  if (status === 'delivered') {
    updatePayload.deliveredAt = new Date();
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: updatePayload
  });
};

module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
};
