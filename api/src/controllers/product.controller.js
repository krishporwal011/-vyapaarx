const { asyncHandler } = require('../middleware/errorHandler');
const productService = require('../services/product.service');

const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.user._id, req.query);
  res.json({ success: true, ...result });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.user._id, req.body);
  res.status(201).json({ success: true, data: product });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.user._id, req.params.id);
  res.json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.user._id, req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
