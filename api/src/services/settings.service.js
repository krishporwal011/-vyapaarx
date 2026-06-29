const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getSettings = async (userId) => {
  let config = await prisma.businessConfig.findUnique({
    where: { userId }
  });

  if (!config) {
    // Return default empty configurations
    config = await prisma.businessConfig.create({
      data: {
        userId,
        gstin: '',
        pan: '',
        bankName: '',
        accountNo: '',
        ifscCode: '',
        invoicePrefix: 'INV'
      }
    });
  }

  // Fetch standard user fields (like user details, address fields, business name)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      businessName: true,
      phone: true,
      gstNumber: true,
      street: true,
      city: true,
      state: true,
      pincode: true,
      country: true
    }
  });

  return {
    ...config,
    user
  };
};

const updateSettings = async (userId, data) => {
  const { gstin, pan, bankName, accountNo, ifscCode, invoicePrefix, name, businessName, phone, street, city, state, pincode, country } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Update/Upsert BusinessConfig
    const config = await tx.businessConfig.upsert({
      where: { userId },
      update: {
        gstin,
        pan,
        bankName,
        accountNo,
        ifscCode,
        invoicePrefix
      },
      create: {
        userId,
        gstin: gstin || '',
        pan: pan || '',
        bankName: bankName || '',
        accountNo: accountNo || '',
        ifscCode: ifscCode || '',
        invoicePrefix: invoicePrefix || 'INV'
      }
    });

    // 2. Update User profile details
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        name,
        businessName,
        phone,
        gstNumber: gstin, // sync user gstNumber with config gstin
        street,
        city,
        state,
        pincode,
        country
      },
      select: {
        name: true,
        email: true,
        businessName: true,
        phone: true,
        gstNumber: true,
        street: true,
        city: true,
        state: true,
        pincode: true,
        country: true
      }
    });

    return {
      ...config,
      user
    };
  });
};

module.exports = {
  getSettings,
  updateSettings
};
