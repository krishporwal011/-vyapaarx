const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

// @POST /api/ai/chat
router.post('/chat', aiController.askChatAssistant);

// @GET /api/ai/forecasts
router.get('/forecasts', aiController.getInventoryForecast);

module.exports = router;
