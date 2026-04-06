const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallengeById);
router.post('/', challengeController.createChallenge);
router.post('/:challengeId/submit', challengeController.submitChallengeEntry);
router.post('/:challengeId/vote/:participantId', challengeController.voteChallengeEntry);
router.get('/:id/leaderboard', challengeController.getChallengeLeaderboard);

module.exports = router;