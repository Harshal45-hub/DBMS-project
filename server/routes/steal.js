const express = require('express');
const router = express.Router();
const stealController = require('../controllers/stealController');

router.post('/', stealController.stealOutfit);
router.get('/popular', stealController.getPopularOutfits);
router.get('/user/:userId', stealController.getUserSteals);
router.post('/:outfitId/like', stealController.likeSteal);

module.exports = router;