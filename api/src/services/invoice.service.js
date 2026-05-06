const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getInvoices = async (userId, queryOptions) => {
  const { page, limit, status, paymentStatus, customerId, search } = queryOptions;
  
  const where = { userId };
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (customerId) where.customerId = customerId;
  
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const skip = (page - 1) * limit;
  const total = await prisma.invoice.count({ where });
  
  const invoices = await prisma.invoice.findMany({
    where,
    skip,
    take: limit,
    include: {
      customer: {
        select: { id: true, name: true, email: true, state: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { data: invoices, total, page, pages: Math.ceil(total / limit) };
};

const createInvoice = async (userId, invoiceData) => {
  const { customerId, supplierId, paymentStatus, paymentMethod, status, dueDate, notes, items } = invoiceData;

  // 1. Fetch Customer & User to determine State-wise GST routing
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) throw new AppError('Customer not found', 404);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  // Compare states for CGST/SGST vs IGST routing (default to CGST/SGST if either state is missing)
  const isIntrastate = !user.state || !customer.state || user.state.trim().toLowerCase() === customer.state.trim().toLowerCase();

  // 2. Generate unique invoice number sequential suffix
  const totalInvoices = await prisma.invoice.count({ where: { userId } });
  const year = new Date().getFullYear();
  const invoiceNumber = `INV-${year}-${String(totalInvoices + 1).padStart(4, '0')}`;

  // 3. Compute live totals
  let subtotal = 0;
  let gstAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  const processedItems = items.map(item => {
    const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
    const lineTotal = discountedPrice * item.quantity;
    const lineGst = lineTotal * ((item.gstRate || 18) / 100);

    subtotal += lineTotal;
    gstAmount += lineGst;

    if (isIntrastate) {
      cgst += lineGst / 2;
      sgst += lineGst / 2;
    } else {
      igst += lineGst;
    }

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      gstRate: item.gstRate || 18,
      hsnCode: item.hsnCode || null,
      total: lineTotal + lineGst,
    };
  });

  const totalAmount = subtotal + gstAmount;

  // 4. Save Invoice, nested items, tax records and payments inside a secure Transaction
  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        userId,
        invoiceNumber,
        customerId,
        supplierId: supplierId || null,
        subtotal,
        gstAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        paymentStatus,
        paymentMethod: paymentMethod || null,
        status: paymentStatus === 'PAID' ? 'paid' : status || 'draft',
        dueDate: dueDate ? new Date(dueDate) : null,
        paidAt: paymentStatus === 'PAID' ? new Date() : null,
        notes: notes || null,
        items: {
          create: processedItems,
        },
      },
    });

    // Create TaxRecords
    if (gstAmount > 0) {
      if (isIntrastate) {
        await tx.taxRecord.createMany({
          data: [
            { invoiceId: invoice.id, taxType: 'CGST', rate: 9, amount: cgst },
            { invoiceId: invoice.id, taxType: 'SGST', rate: 9, amount: sgst },
          ],
        });
      } else {
        await tx.taxRecord.create({
          data: { invoiceId: invoice.id, taxType: 'IGST', rate: 18, amount: igst },
        });
      }
    }

    // Create Payment record if fully or partially paid
    if (paymentStatus === 'PAID') {
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: totalAmount,
          paymentMethod: paymentMethod || 'CASH',
        },
      });
    } else if (paymentStatus === 'PARTIAL') {
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: totalAmount / 2, // Default partial payment representation
          paymentMethod: paymentMethod || 'CASH',
        },
      });
    }

    return invoice;
  });
};

const getInvoiceById = async (userId, invoiceId) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      customer: true,
      supplier: true,
      items: {
        include: {
          product: {
            select: { id: true, name: true, sku: true }
          }
        }
      },
      payments: true,
      taxRecords: true,
    }
  });
  
  if (!invoice) throw new AppError('Invoice not found', 404);
  return invoice;
};

const updateInvoice = async (userId, invoiceId, invoiceData) => {
  const invoiceExists = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoiceExists) throw new AppError('Invoice not found', 404);

  const { customerId, supplierId, paymentStatus, paymentMethod, status, dueDate, notes, items } = invoiceData;

  const targetCustomerId = customerId || invoiceExists.customerId;

  // 1. Fetch Customer & User for State checks
  const customer = await prisma.customer.findUnique({ where: { id: targetCustomerId } });
  if (!customer) throw new AppError('Customer not found', 404);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isIntrastate = !user.state || !customer.state || user.state.trim().toLowerCase() === customer.state.trim().toLowerCase();

  return await prisma.$transaction(async (tx) => {
    // If updating items, compute new totals
    if (items) {
      let subtotal = 0;
      let gstAmount = 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      const processedItems = items.map(item => {
        const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
        const lineTotal = discountedPrice * item.quantity;
        const lineGst = lineTotal * ((item.gstRate || 18) / 100);

        subtotal += lineTotal;
        gstAmount += lineGst;

        if (isIntrastate) {
          cgst += lineGst / 2;
          sgst += lineGst / 2;
        } else {
          igst += lineGst;
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          gstRate: item.gstRate || 18,
          hsnCode: item.hsnCode || null,
          total: lineTotal + lineGst,
        };
      });

      const totalAmount = subtotal + gstAmount;

      // Wipe old items and tax records
      await tx.invoiceItem.deleteMany({ where: { invoiceId } });
      await tx.taxRecord.deleteMany({ where: { invoiceId } });

      // Create new TaxRecords
      if (gstAmount > 0) {
        if (isIntrastate) {
          await tx.taxRecord.createMany({
            data: [
              { invoiceId, taxType: 'CGST', rate: 9, amount: cgst },
              { invoiceId, taxType: 'SGST', rate: 9, amount: sgst },
            ],
          });
        } else {
          await tx.taxRecord.create({
            data: { invoiceId, taxType: 'IGST', rate: 18, amount: igst },
          });
        }
      }

      return await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          customerId: targetCustomerId,
          supplierId: supplierId || null,
          subtotal,
          gstAmount,
          cgst,
          sgst,
          igst,
          totalAmount,
          paymentStatus: paymentStatus || invoiceExists.paymentStatus,
          paymentMethod: paymentMethod || invoiceExists.paymentMethod,
          status: status || invoiceExists.status,
          dueDate: dueDate ? new Date(dueDate) : invoiceExists.dueDate,
          notes: notes || null,
          items: {
            create: processedItems,
          },
        },
      });
    }

    // Direct update without items modification
    return await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        customerId: targetCustomerId,
        supplierId: supplierId || null,
        paymentStatus: paymentStatus || invoiceExists.paymentStatus,
        paymentMethod: paymentMethod || invoiceExists.paymentMethod,
        status: status || invoiceExists.status,
        dueDate: dueDate ? new Date(dueDate) : invoiceExists.dueDate,
        notes: notes || null,
      },
    });
  });
};

const deleteInvoice = async (userId, invoiceId) => {
  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, userId } });
  if (!invoice) throw new AppError('Invoice not found', 404);

  // Cascade delete is handled by database ON DELETE CASCADE as declared in prisma schema
  return await prisma.invoice.delete({ where: { id: invoiceId } });
};

const getInvoiceAnalytics = async (userId) => {
  const invoices = await prisma.invoice.findMany({
    where: { userId, status: { not: 'cancelled' } },
    include: { payments: true }
  });

  const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const gstCollected = invoices.reduce((sum, inv) => sum + inv.gstAmount, 0);
  
  const pendingPayments = invoices
    .filter(inv => inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PARTIAL')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Group by month
  const monthlyMap = {};
  invoices.forEach(inv => {
    const monthStr = new Date(inv.createdAt).toLocaleString('default', { month: 'short' });
    monthlyMap[monthStr] = (monthlyMap[monthStr] || 0) + inv.totalAmount;
  });

  const monthlyRevenue = Object.entries(monthlyMap).map(([month, amount]) => ({
    month,
    revenue: amount,
  }));

  return {
    totalSales,
    gstCollected,
    pendingPayments,
    monthlyRevenue,
  };
};

module.exports = {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceAnalytics,
};
