const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(settingsController.getSettingsConfig)
  .put(settingsController.updateSettingsConfig);

module.exports = router;
