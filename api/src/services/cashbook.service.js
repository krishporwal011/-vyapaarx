const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getCashbookEntries = async (userId) => {
  return await prisma.cashbookEntry.findMany({
    where: { userId },
    orderBy: { date: 'desc' }
  });
};

const createCashbookEntry = async (userId, data) => {
  const { type, category, amount, notes, date } = data;
  
  if (!type || !category || !amount) {
    throw new AppError('Type, category, and amount are required', 400);
  }

  return await prisma.cashbookEntry.create({
    data: {
      userId,
      type,
      category,
      amount: parseFloat(amount),
      notes: notes || null,
      date: date ? new Date(date) : new Date()
    }
  });
};

const deleteCashbookEntry = async (userId, entryId) => {
  const entry = await prisma.cashbookEntry.findFirst({
    where: { id: entryId, userId }
  });

  if (!entry) {
    throw new AppError('Cashbook entry not found', 404);
  }

  return await prisma.cashbookEntry.delete({
    where: { id: entryId }
  });
};

module.exports = {
  getCashbookEntries,
  createCashbookEntry,
  deleteCashbookEntry
};
