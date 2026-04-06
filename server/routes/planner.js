const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

router.get('/', plannerController.getPlannedOutfits);
router.post('/schedule', plannerController.scheduleOutfit);
router.get('/suggestions', plannerController.getOutfitSuggestionsForDate);
router.get('/history/:itemId', plannerController.getWearHistory);
router.get('/summary', plannerController.getMonthlySummary);

module.exports = router;