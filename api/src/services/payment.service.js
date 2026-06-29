const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getTransactions = async (userId) => {
  return await prisma.payment.findMany({
    where: {
      invoice: { userId }
    },
    include: {
      invoice: {
        select: { id: true, invoiceNumber: true, customerId: true, customer: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const createTransaction = async (userId, data) => {
  const { invoiceId, amount, paymentMethod, referenceNumber, status, upiId, razorpayId, payerName, settlementStatus } = data;

  if (!invoiceId || !amount || !paymentMethod) {
    throw new AppError('InvoiceId, amount, and paymentMethod are required', 400);
  }

  // Verify invoice belongs to the user
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId }
  });

  if (!invoice) {
    throw new AppError('Invoice not found or unauthorized', 404);
  }

  return await prisma.payment.create({
    data: {
      invoiceId,
      amount: parseFloat(amount),
      paymentMethod,
      referenceNumber: referenceNumber || null,
      status: status || 'SUCCESS',
      upiId: upiId || null,
      razorpayId: razorpayId || null,
      payerName: payerName || null,
      settlementStatus: settlementStatus || 'SETTLED'
    }
  });
};

const updateTransaction = async (userId, txnId, data) => {
  const transaction = await prisma.payment.findFirst({
    where: {
      id: txnId,
      invoice: { userId }
    }
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  return await prisma.payment.update({
    where: { id: txnId },
    data: {
      status: data.status,
      settlementStatus: data.settlementStatus,
      referenceNumber: data.referenceNumber
    }
  });
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction
};
