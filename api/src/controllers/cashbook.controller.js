const { asyncHandler } = require('../middleware/errorHandler');
const cashbookService = require('../services/cashbook.service');

const getEntries = asyncHandler(async (req, res) => {
  const entries = await cashbookService.getCashbookEntries(req.user._id);
  res.json({ success: true, data: entries });
});

const createEntry = asyncHandler(async (req, res) => {
  const entry = await cashbookService.createCashbookEntry(req.user._id, req.body);
  res.status(201).json({ success: true, data: entry });
});

const deleteEntry = asyncHandler(async (req, res) => {
  await cashbookService.deleteCashbookEntry(req.user._id, req.params.id);
  res.json({ success: true, message: 'Cashbook entry deleted successfully' });
});

module.exports = {
  getEntries,
  createEntry,
  deleteEntry
};
