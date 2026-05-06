const { asyncHandler } = require('../middleware/errorHandler');
const aiService = require('../services/ai.service');

const askChatAssistant = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  const reply = await aiService.askChatAssistant(req.user._id, message, history);
  res.json({ success: true, data: reply });
});

const getInventoryForecast = asyncHandler(async (req, res) => {
  const forecasts = await aiService.getInventoryForecasting(req.user._id);
  res.json({ success: true, data: forecasts });
});

module.exports = {
  askChatAssistant,
  getInventoryForecast,
};
