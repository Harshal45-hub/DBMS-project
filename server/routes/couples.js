const express = require('express');
const router = express.Router();
const couplesController = require('../controllers/couplesController');

router.post('/pair', couplesController.pairWardrobes);
router.get('/suggestions/:partnerWardrobeId', couplesController.getCoupleSuggestions);
router.post('/date-night', couplesController.planDateNight);
router.get('/gifts/:partnerId', couplesController.getGiftSuggestions);

module.exports = router;