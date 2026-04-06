const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');

router.post('/comments', socialController.addComment);
router.get('/comments/:itemId', socialController.getComments);
router.post('/vote', socialController.castVote);
router.get('/feed', socialController.getSocialFeed);
router.post('/challenges/join', socialController.joinChallenge);
router.get('/challenges/active', socialController.getActiveChallenges);

module.exports = router;