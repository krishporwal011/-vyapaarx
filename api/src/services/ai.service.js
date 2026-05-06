const prisma = require('../utils/prisma');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI safely
let genAI = null;

if (
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY.trim() !== ''
) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully');
  } catch (err) {
    console.error('❌ Failed to initialize Gemini AI:', err.message);
  }
}

/**
 * TOP SELLING PRODUCTS
 */
const getTopSellingProducts = async (userId) => {
  const items = await prisma.invoiceItem.findMany({
    where: {
      invoice: {
        userId,
        status: { not: 'cancelled' },
      },
    },
    include: {
      product: true,
    },
  });

  const productMap = {};

  items.forEach((item) => {
    const name = item.product.name;
    const sku = item.product.sku;

    if (!productMap[name]) {
      productMap[name] = {
        sku,
        quantity: 0,
        revenue: 0,
      };
    }

    productMap[name].quantity += item.quantity;
    productMap[name].revenue += item.total;
  });

  return Object.entries(productMap)
    .map(([name, stats]) => ({
      name,
      sku: stats.sku,
      quantity: stats.quantity,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
};

/**
 * PENDING PAYMENTS
 */
const getPendingPayments = async (userId) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      paymentStatus: {
        in: ['UNPAID', 'PARTIAL'],
      },
      status: {
        not: 'cancelled',
      },
    },
    include: {
      customer: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  });

  return invoices.map((invoice) => ({
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customer.name,
    totalAmount: invoice.totalAmount,
    status: invoice.paymentStatus,
    dueDate: invoice.dueDate
      ? invoice.dueDate.toLocaleDateString('en-IN')
      : 'N/A',
  }));
};

/**
 * GST COLLECTION SUMMARY
 */
const getGstCollected = async (userId) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      status: {
        not: 'cancelled',
      },
    },
  });

  let totalSales = 0;
  let gstAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  invoices.forEach((invoice) => {
    totalSales += invoice.subtotal;
    gstAmount += invoice.gstAmount;
    cgst += invoice.cgst;
    sgst += invoice.sgst;
    igst += invoice.igst;
  });

  return {
    totalSales,
    gstAmount,
    cgst,
    sgst,
    igst,
  };
};

/**
 * INVENTORY FORECASTING
 */
const getInventoryForecasting = async (userId) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
      isActive: true,
    },
  });

  const invoiceItems = await prisma.invoiceItem.findMany({
    where: {
      invoice: {
        userId,
        status: {
          not: 'cancelled',
        },
      },
    },
  });

  const salesMap = {};

  invoiceItems.forEach((item) => {
    salesMap[item.productId] =
      (salesMap[item.productId] || 0) + item.quantity;
  });

  const lowStockPredictions = [];
  const deadInventory = [];
  const fastMoving = [];

  products.forEach((product) => {
    const quantitySold = salesMap[product.id] || 0;

    const status =
      product.stock <= product.lowStockThreshold
        ? 'CRITICAL'
        : product.stock <= product.lowStockThreshold * 2
          ? 'WARNING'
          : 'HEALTHY';

    const monthlyVelocity =
      quantitySold > 0 ? quantitySold * 1.5 : 0;

    const prediction = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      currentStock: product.stock,
      threshold: product.lowStockThreshold,
      status,
      monthlyVelocity,
      daysToEmpty:
        product.stock > 0 && monthlyVelocity > 0
          ? Math.ceil((product.stock / monthlyVelocity) * 30)
          : 999,
      recommendedReorder:
        product.stock <= product.lowStockThreshold
          ? product.lowStockThreshold * 3
          : 0,
    };

    lowStockPredictions.push(prediction);

    if (product.stock > 0 && quantitySold === 0) {
      deadInventory.push({
        name: product.name,
        sku: product.sku,
        currentStock: product.stock,
      });
    }

    if (quantitySold > 10) {
      fastMoving.push({
        name: product.name,
        sku: product.sku,
        quantitySold,
      });
    }
  });

  return {
    lowStockPredictions: lowStockPredictions.sort(
      (a, b) => a.daysToEmpty - b.daysToEmpty
    ),
    deadInventory,
    fastMoving,
  };
};

/**
 * AI CHAT ASSISTANT
 */
const askChatAssistant = async (
  userId,
  message,
  history = []
) => {
  const msgLower = message.toLowerCase();

  let databaseContext = '';
  let topSelling = null;
  let pendingPayments = null;
  let gstCollected = null;
  let forecasts = null;

  if (
    msgLower.includes('selling') ||
    msgLower.includes('product') ||
    msgLower.includes('item')
  ) {
    topSelling = await getTopSellingProducts(userId);

    databaseContext += `
[TOP SELLING PRODUCTS]
${JSON.stringify(topSelling, null, 2)}
`;
  }

  if (
    msgLower.includes('pending') ||
    msgLower.includes('payment') ||
    msgLower.includes('receivable') ||
    msgLower.includes('unpaid')
  ) {
    pendingPayments = await getPendingPayments(userId);

    databaseContext += `
[PENDING PAYMENTS]
${JSON.stringify(pendingPayments, null, 2)}
`;
  }

  if (
    msgLower.includes('gst') ||
    msgLower.includes('tax')
  ) {
    gstCollected = await getGstCollected(userId);

    databaseContext += `
[GST SUMMARY]
${JSON.stringify(gstCollected, null, 2)}
`;
  }

  if (
    msgLower.includes('stock') ||
    msgLower.includes('inventory') ||
    msgLower.includes('forecast')
  ) {
    forecasts = await getInventoryForecasting(userId);

    databaseContext += `
[INVENTORY FORECAST]
${JSON.stringify(forecasts, null, 2)}
`;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const totalInvoices = await prisma.invoice.count({
    where: { userId },
  });

  const totalProducts = await prisma.product.count({
    where: { userId },
  });

  const totalCustomers = await prisma.customer.count({
    where: { userId },
  });

  databaseContext += `
[BUSINESS OVERVIEW]
Business Name: ${user?.businessName || 'VyapaarX Business'}
Invoices: ${totalInvoices}
Products: ${totalProducts}
Customers: ${totalCustomers}
`;

  /**
   * GEMINI AI RESPONSE
   */
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `
You are VyapaarX AI Accountant.

You are a professional ERP business advisor.

Use clean markdown formatting.

BUSINESS DATABASE CONTEXT:
${databaseContext}

CHAT HISTORY:
${JSON.stringify(history)}

USER QUESTION:
${message}
`;

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (err) {
      console.error(
        '❌ Gemini AI failed:',
        err.message
      );
    }
  }

  /**
   * FALLBACK RESPONSE
   */
  return `
# VyapaarX AI Assistant

Hello! Your AI business assistant is active.

## Business Overview

- Products: ${totalProducts}
- Customers: ${totalCustomers}
- Invoices: ${totalInvoices}

You can ask:

- Top selling products
- GST reports
- Pending payments
- Inventory forecasting
- Sales analytics
`;
};

module.exports = {
  getTopSellingProducts,
  getPendingPayments,
  getGstCollected,
  getInventoryForecasting,
  askChatAssistant,
};