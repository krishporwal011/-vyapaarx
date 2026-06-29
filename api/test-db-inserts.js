require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function testDatabaseCreation() {
  console.log('🔍 Testing DB inserts against Neon PostgreSQL (full payload)...');
  
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('❌ No user found in the DB. Populate database first.');
    process.exit(1);
  }
  
  const customer = await prisma.customer.findFirst({ where: { userId: user.id } });
  if (!customer) {
    console.error('❌ No customer found in the DB.');
    process.exit(1);
  }

  const product = await prisma.product.findFirst({ where: { userId: user.id } });
  if (!product) {
    console.error('❌ No product found in the DB.');
    process.exit(1);
  }

  // Test Invoice Creation with full payload (TaxRecords & Payments)
  console.log('\n--- 2. Testing Full Invoice Creation ---');
  try {
    const totalInvoices = await prisma.invoice.count({ where: { userId: user.id } });
    const invoiceNumber = `INV-2026-${String(totalInvoices + 1).padStart(4, '0')}`;
    const newInvoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          userId: user.id,
          invoiceNumber,
          customerId: customer.id,
          subtotal: product.price,
          gstAmount: product.price * 0.18,
          cgst: product.price * 0.09,
          sgst: product.price * 0.09,
          igst: 0,
          totalAmount: product.price * 1.18,
          paymentStatus: 'PAID',
          status: 'paid',
          items: {
            create: [
              {
                productId: product.id,
                quantity: 1,
                price: product.price,
                discount: 0,
                gstRate: 18,
                total: product.price * 1.18
              }
            ]
          }
        }
      });

      // Create TaxRecords
      await tx.taxRecord.createMany({
        data: [
          { invoiceId: invoice.id, taxType: 'CGST', rate: 9, amount: product.price * 0.09 },
          { invoiceId: invoice.id, taxType: 'SGST', rate: 9, amount: product.price * 0.09 }
        ]
      });

      // Create Payment
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: product.price * 1.18,
          paymentMethod: 'CASH'
        }
      });

      return invoice;
    });

    console.log('✅ Full Invoice created successfully in Neon:', newInvoice.id, newInvoice.invoiceNumber);
    // Cleanup invoice
    await prisma.payment.deleteMany({ where: { invoiceId: newInvoice.id } });
    await prisma.taxRecord.deleteMany({ where: { invoiceId: newInvoice.id } });
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: newInvoice.id } });
    await prisma.invoice.delete({ where: { id: newInvoice.id } });
    console.log('🧹 Cleaned up test invoice.');
  } catch (err) {
    console.error('❌ Full Invoice creation failed:', err);
  }

  await prisma.$disconnect();
}

testDatabaseCreation();
