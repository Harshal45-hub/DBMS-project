const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');

router.post('/generate', outfitController.generateOutfit);
router.get('/history', outfitController.getOutfitHistory);
router.post('/rate', outfitController.rateOutfit);

module.exports = router;