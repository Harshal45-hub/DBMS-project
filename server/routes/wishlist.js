const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.get('/', wishlistController.getWishlist);
router.post('/items', wishlistController.addToWishlist);
router.delete('/items/:userId/:itemId', wishlistController.removeFromWishlist);
router.post('/share', wishlistController.shareWishlist);
router.get('/shared/:token', wishlistController.getSharedWishlist);

module.exports = router;