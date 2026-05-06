const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validate = require('../middleware/validate');
const {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  deleteProductSchema,
} = require('../validations/product.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/products
router.get('/', validate(getProductsSchema), productController.getProducts);

// @POST /api/products
router.post('/', validate(createProductSchema), productController.createProduct);

// @GET /api/products/:id
router.get('/:id', validate(getProductByIdSchema), productController.getProductById);

// @PUT /api/products/:id
router.put('/:id', validate(updateProductSchema), productController.updateProduct);

// @DELETE /api/products/:id
router.delete('/:id', validate(deleteProductSchema), productController.deleteProduct);

module.exports = router;
