const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');

router.get('/suggestions/:partnerId', giftController.getGiftSuggestions);
router.post('/purchase', giftController.purchaseGift);
router.get('/history/:userId', giftController.getGiftHistory);

module.exports = router;