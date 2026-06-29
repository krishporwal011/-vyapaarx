const prisma = require('../utils/prisma');

const getOverview = async (userId) => {
  const totalOrders = await prisma.order.count({ where: { userId } });
  
  const revenueResult = await prisma.order.aggregate({
    where: { userId, paymentStatus: 'paid' },
    _sum: { total: true }
  });
  const totalRevenue = revenueResult._sum.total || 0;

  const totalProducts = await prisma.product.count({ where: { userId, isActive: true } });
  const totalCustomers = await prisma.customer.count({ where: { userId, isActive: true } });
  
  const overdueInvoices = await prisma.invoice.count({ where: { userId, status: 'overdue' } });

  // Low stock is tricky in pure Prisma count without raw SQL, because we need to compare two columns (stock <= lowStockThreshold).
  // A raw query is most efficient here:
  const lowStockResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Product" WHERE "userId" = ${userId} AND stock <= "lowStockThreshold" AND "isActive" = true`;
  // $queryRaw returns BigInt for COUNT in Postgres, so we cast to Number
  const lowStockCount = Number(lowStockResult[0]?.count || 0);

  return {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    lowStockCount,
    overdueInvoices,
  };
};

const getRevenue = async (userId, periodDays) => {
  const days = parseInt(periodDays) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Group by date to get daily revenue. 
  // Postgres DATE_TRUNC is best for this via $queryRaw.
  const revenue = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM-DD') as "_id",
      SUM("total") as revenue,
      COUNT(*)::int as orders
    FROM "Order"
    WHERE "userId" = ${userId} 
      AND "createdAt" >= ${startDate} 
      AND ("paymentStatus" = 'paid' OR "paymentStatus" = 'PAID')
    GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD')
    ORDER BY "_id" ASC
  `;

  return revenue;
};

const getTopProducts = async (userId) => {
  // Aggregate top products sold by quantity and revenue.
  // We join OrderItem to Order to ensure it belongs to the user.
  const topProducts = await prisma.$queryRaw`
    SELECT 
      oi."productId" as "_id",
      oi."name",
      SUM(oi."quantity")::int as "totalSold",
      SUM(oi."total") as "revenue"
    FROM "OrderItem" oi
    JOIN "Order" o ON oi."orderId" = o.id
    WHERE o."userId" = ${userId}
    GROUP BY oi."productId", oi."name"
    ORDER BY "revenue" DESC
    LIMIT 5
  `;

  return topProducts;
};

module.exports = {
  getOverview,
  getRevenue,
  getTopProducts,
};
