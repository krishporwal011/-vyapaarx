const { asyncHandler } = require('../middleware/errorHandler');
const supplierService = require('../services/supplier.service');

const getSuppliers = asyncHandler(async (req, res) => {
  const result = await supplierService.getSuppliers(req.user._id, req.query);
  res.json({ success: true, ...result });
});

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.user._id, req.body);
  res.status(201).json({ success: true, data: supplier });
});

const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.user._id, req.params.id);
  res.json({ success: true, data: supplier });
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.updateSupplier(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: supplier });
});

const deleteSupplier = asyncHandler(async (req, res) => {
  await supplierService.deleteSupplier(req.user._id, req.params.id);
  res.json({ success: true, message: 'Supplier deleted successfully' });
});

const getSupplierAnalytics = asyncHandler(async (req, res) => {
  const analytics = await supplierService.getSupplierAnalytics(req.user._id);
  res.json({ success: true, data: analytics });
});

module.exports = {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierAnalytics,
};
