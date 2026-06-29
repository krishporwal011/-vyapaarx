const express = require('express');
const router = express.Router();
const cashbookController = require('../controllers/cashbook.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(cashbookController.getEntries)
  .post(cashbookController.createEntry);

router.route('/:id')
  .delete(cashbookController.deleteEntry);

module.exports = router;
