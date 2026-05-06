const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const validate = require('../middleware/validate');
const { getRevenueSchema } = require('../validations/analytics.validation');
const { protect } = require('../middleware/auth');

router.use(protect);

// @GET /api/analytics/overview
router.get('/overview', analyticsController.getOverview);

// @GET /api/analytics/revenue?period=7|30|90
router.get('/revenue', validate(getRevenueSchema), analyticsController.getRevenue);

// @GET /api/analytics/top-products
router.get('/top-products', analyticsController.getTopProducts);

module.exports = router;
