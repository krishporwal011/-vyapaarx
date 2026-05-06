const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getCustomers = async (userId, queryOptions) => {
  const { page, limit, search, type } = queryOptions;
  
  const where = { userId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (type) {
    where.type = type;
  }

  const skip = (page - 1) * limit;
  const total = await prisma.customer.count({ where });
  
  const customers = await prisma.customer.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  return { data: customers, total, page, pages: Math.ceil(total / limit) };
};

const createCustomer = async (userId, customerData) => {
  // If customerData contains an address object, we need to flatten it since we flattened it in Prisma
  let dataToCreate = { ...customerData, userId };
  
  if (customerData.address) {
    dataToCreate = {
      ...dataToCreate,
      ...customerData.address
    };
    delete dataToCreate.address;
  }

  return await prisma.customer.create({
    data: dataToCreate
  });
};

const getCustomerById = async (userId, customerId) => {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, userId }
  });
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
};

const updateCustomer = async (userId, customerId, updateData) => {
  const customer = await prisma.customer.findFirst({ where: { id: customerId, userId } });
  if (!customer) throw new AppError('Customer not found', 404);

  let dataToUpdate = { ...updateData };
  if (updateData.address) {
    dataToUpdate = {
      ...dataToUpdate,
      ...updateData.address
    };
    delete dataToUpdate.address;
  }

  return await prisma.customer.update({
    where: { id: customerId },
    data: dataToUpdate
  });
};

const deleteCustomer = async (userId, customerId) => {
  const customer = await prisma.customer.findFirst({ where: { id: customerId, userId } });
  if (!customer) throw new AppError('Customer not found', 404);

  return await prisma.customer.delete({
    where: { id: customerId }
  });
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
