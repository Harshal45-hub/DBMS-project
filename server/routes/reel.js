const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');

// Get all reels
router.get('/feed', reelController.getReelFeed);

// Get trending reels
router.get('/trending', reelController.getTrendingReels);

// Get reel by ID
router.get('/:reelId', reelController.getReelById);

// Create a new reel
router.post('/', reelController.createReel);

// Update reel
router.put('/:reelId', reelController.updateReel);

// Delete reel
router.delete('/:reelId', reelController.deleteReel);

// Increment views
router.post('/:reelId/view', reelController.incrementViews);

// Like a reel
router.post('/:reelId/like', reelController.likeReel);

// Unlike a reel
router.delete('/:reelId/like', reelController.unlikeReel);

// Add comment to reel
router.post('/:reelId/comment', reelController.addComment);

// Get comments for reel
router.get('/:reelId/comments', reelController.getComments);

// Delete comment from reel
router.delete('/:reelId/comment/:commentId', reelController.deleteComment);

// Get user's reels
router.get('/user/:userId', reelController.getUserReels);

// Save reel to collection
router.post('/:reelId/save', reelController.saveReel);

// Get saved reels
router.get('/saved/:userId', reelController.getSavedReels);

module.exports = router;