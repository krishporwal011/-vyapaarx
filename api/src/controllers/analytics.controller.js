const { asyncHandler } = require('../middleware/errorHandler');
const analyticsService = require('../services/analytics.service');

const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user._id);
  res.json({ success: true, data });
});

const getRevenue = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenue(req.user._id, req.query.period);
  res.json({ success: true, data });
});

const getTopProducts = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopProducts(req.user._id);
  res.json({ success: true, data });
});

module.exports = {
  getOverview,
  getRevenue,
  getTopProducts,
};
