const { asyncHandler } = require('../middleware/errorHandler');
const settingsService = require('../services/settings.service');

const getSettingsConfig = asyncHandler(async (req, res) => {
  const config = await settingsService.getSettings(req.user._id);
  res.json({ success: true, data: config });
});

const updateSettingsConfig = asyncHandler(async (req, res) => {
  const config = await settingsService.updateSettings(req.user._id, req.body);
  res.json({ success: true, data: config });
});

module.exports = {
  getSettingsConfig,
  updateSettingsConfig
};
