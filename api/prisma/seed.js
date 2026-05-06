const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing records to ensure idempotency
  console.log('Clearing old records...');
  try {
    await prisma.invoice.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    console.log('Error clearing tables:', err.message);
  }

  // 0. Create an Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@vyapaarx.com',
      password: '$2b$10$r9G.3/gU/zH0oKqTHe/j4eXgYgTzJ54vB/qW.pZg1F2qH.bA3gWfK', // hashed password
      businessName: 'Vyapaar X Demo',
      state: 'Maharashtra',
      role: 'admin'
    }
  });

  const userId = adminUser.id;

  // 1. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      userId,
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      type: 'wholesale',
      street: 'Flat 402, Sea View Apts',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId,
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 87654 32109',
      type: 'retail',
      street: 'B-12, Sector 4',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  });

  // 2. Create Products
  const product1 = await prisma.product.create({
    data: {
      userId,
      name: 'Cotton Kurta Set',
      sku: 'KRT-001',
      category: 'Apparel',
      price: 2000,
      stock: 142,
      lowStockThreshold: 20,
      gstRate: 5
    }
  });

  const product2 = await prisma.product.create({
    data: {
      userId,
      name: 'Brass Ganesha Idol',
      sku: 'BRS-G01',
      category: 'Decor',
      price: 3000,
      stock: 5,
      lowStockThreshold: 10,
      gstRate: 12
    }
  });

  const product3 = await prisma.product.create({
    data: {
      userId,
      name: 'Organic Spice Hamper',
      sku: 'SPH-ORG',
      category: 'Food',
      price: 2000,
      stock: 8,
      lowStockThreshold: 15,
      gstRate: 0
    }
  });

  // 3. Create Orders
  await prisma.order.create({
    data: {
      userId,
      orderNumber: 'VX-48291031',
      customerId: customer1.id,
      status: 'delivered',
      paymentStatus: 'paid',
      subtotal: 4000,
      gstAmount: 200,
      total: 4200,
      items: {
        create: [
          {
            productId: product1.id,
            name: product1.name,
            quantity: 2,
            price: 2000,
            total: 4000
          }
        ]
      }
    }
  });

  await prisma.order.create({
    data: {
      userId,
      orderNumber: 'VX-48291032',
      customerId: customer2.id,
      status: 'pending',
      paymentStatus: 'unpaid',
      subtotal: 3000,
      gstAmount: 360,
      total: 3360,
      items: {
        create: [
          {
            productId: product2.id,
            name: product2.name,
            quantity: 1,
            price: 3000,
            total: 3000
          }
        ]
      }
    }
  });

  // 4. Create Suppliers
  console.log('Seeding suppliers...');
  await prisma.supplier.createMany({
    data: [
      {
        userId,
        supplierCode: 'SUP-4011',
        name: 'Surat Textile Fabrics',
        email: 'sales@suratfabrics.com',
        phone: '+91 99123 45678',
        gstNumber: '24AAAAA1111A1Z1',
        panNumber: 'ABCDE1111A',
        address: '102, Ring Road Textile Market',
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395003',
        status: 'ACTIVE',
        notes: 'Primary supplier for organic cotton and linen materials.',
      },
      {
        userId,
        supplierCode: 'SUP-2041',
        name: 'Moradabad Brassworks Corp',
        email: 'info@moradabadbrass.in',
        phone: '+91 98321 87654',
        gstNumber: '09BBBBB2222B2Z2',
        panNumber: 'FGHIJ2222B',
        address: 'Plot 45, Industrial Brass Area',
        city: 'Moradabad',
        state: 'Uttar Pradesh',
        country: 'India',
        pincode: '244001',
        status: 'ACTIVE',
        notes: 'Primary craft supplier for high-quality metal works and idols.',
      },
      {
        userId,
        supplierCode: 'SUP-1022',
        name: 'Kerala Spice Estates',
        email: 'spices@keralaestates.com',
        phone: '+91 94440 12345',
        gstNumber: '32CCCCC3333C3Z3',
        panNumber: 'KLMNO3333C',
        address: 'Vazhathope Estate, Idukki District',
        city: 'Munnar',
        state: 'Kerala',
        country: 'India',
        pincode: '685612',
        status: 'INACTIVE',
        notes: 'Spice vendor currently on-hold due to organic certification renewal.',
      },
      {
        userId,
        supplierCode: 'SUP-9015',
        name: 'Jaipur Handblock Printers',
        email: 'jaipur@handblocks.co.in',
        phone: '+91 91122 33445',
        gstNumber: '08DDDDD4444D4Z4',
        panNumber: 'PQRST4444D',
        address: 'Sanganer Industrial Craft Block',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        pincode: '302029',
        status: 'ACTIVE',
        notes: 'Artisanal printing workshop for handblock linens.',
      }
    ]
  });

  console.log('Seeding GST invoices and payment ledgers...');
  
  // Seed Invoice 1: PAID, Intrastate (CGST/SGST)
  const invoice1 = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber: 'INV-2026-0001',
      customerId: customer1.id, // Priya Sharma (Maharashtra - Intrastate)
      subtotal: 4000,
      gstAmount: 200,
      cgst: 100,
      sgst: 100,
      igst: 0,
      totalAmount: 4200,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      status: 'paid',
      dueDate: new Date('2026-05-20'),
      paidAt: new Date('2026-05-02'),
      notes: 'Terms: 18% interest charged if not paid by due date.',
      createdAt: new Date('2026-05-02'),
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            price: 2000,
            discount: 0,
            gstRate: 5,
            hsnCode: 'HSN-6204',
            total: 4200,
          }
        ]
      },
      taxRecords: {
        create: [
          { taxType: 'CGST', rate: 2.5, amount: 100 },
          { taxType: 'SGST', rate: 2.5, amount: 100 }
        ]
      },
      payments: {
        create: [
          { amount: 4200, paymentMethod: 'UPI', paymentDate: new Date('2026-05-02') }
        ]
      }
    }
  });

  // Seed Invoice 2: UNPAID, Interstate (IGST)
  const invoice2 = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber: 'INV-2026-0002',
      customerId: customer2.id, // Rahul Verma (Delhi - Interstate)
      subtotal: 3000,
      gstAmount: 360,
      cgst: 0,
      sgst: 0,
      igst: 360,
      totalAmount: 3360,
      paymentStatus: 'UNPAID',
      status: 'sent',
      dueDate: new Date('2026-06-15'),
      notes: 'Please quote invoice number on bank transfers.',
      createdAt: new Date('2026-05-10'),
      items: {
        create: [
          {
            productId: product2.id,
            quantity: 1,
            price: 3000,
            discount: 0,
            gstRate: 12,
            hsnCode: 'HSN-8306',
            total: 3360,
          }
        ]
      },
      taxRecords: {
        create: [
          { taxType: 'IGST', rate: 12, amount: 360 }
        ]
      }
    }
  });

  // Seed Invoice 3: PARTIAL, Intrastate (CGST/SGST)
  const invoice3 = await prisma.invoice.create({
    data: {
      userId,
      invoiceNumber: 'INV-2026-0003',
      customerId: customer1.id, // Priya Sharma (Maharashtra - Intrastate)
      subtotal: 4000,
      gstAmount: 200,
      cgst: 100,
      sgst: 100,
      igst: 0,
      totalAmount: 4200,
      paymentStatus: 'PARTIAL',
      paymentMethod: 'CASH',
      status: 'sent',
      dueDate: new Date('2026-05-25'),
      createdAt: new Date('2026-04-15'),
      items: {
        create: [
          {
            productId: product3.id,
            quantity: 2,
            price: 2000,
            discount: 0,
            gstRate: 5,
            hsnCode: 'HSN-0910',
            total: 4200,
          }
        ]
      },
      taxRecords: {
        create: [
          { taxType: 'CGST', rate: 2.5, amount: 100 },
          { taxType: 'SGST', rate: 2.5, amount: 100 }
        ]
      },
      payments: {
        create: [
          { amount: 2100, paymentMethod: 'CASH', paymentDate: new Date('2026-04-20') }
        ]
      }
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
