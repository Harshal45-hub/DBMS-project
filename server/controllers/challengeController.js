const Challenge = require('../models/Challenge');
const OutfitHistory = require('../models/OutfitHistory');
const ClothingItem = require('../models/ClothingItem');

exports.getAllChallenges = async (req, res, next) => {
  try {
    const { active } = req.query;
    
    const query = {};
    if (active === 'true') {
      query.active = true;
      query.endDate = { $gt: new Date() };
    }
    
    const challenges = await Challenge.find(query).sort({ startDate: -1 });
    
    res.json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

exports.getChallengeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    
    res.json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

exports.createChallenge = async (req, res, next) => {
  try {
    const challengeData = req.body;
    
    const challenge = new Challenge(challengeData);
    await challenge.save();
    
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

exports.submitChallengeEntry = async (req, res, next) => {
  try {
    const { challengeId, userId, outfitId } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    
    const existingEntry = challenge.participants.find(p => p.userId === userId);
    if (existingEntry) {
      return res.status(400).json({ success: false, error: 'Already submitted for this challenge' });
    }
    
    challenge.participants.push({
      userId,
      outfitId,
      votes: 0,
      submittedAt: new Date()
    });
    
    await challenge.save();
    
    res.json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

exports.voteChallengeEntry = async (req, res, next) => {
  try {
    const { challengeId, participantId } = req.params;
    
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    
    const participant = challenge.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, error: 'Participant not found' });
    }
    
    participant.votes += 1;
    await challenge.save();
    
    res.json({ success: true, data: challenge });
  } catch (error) {
    next(error);
  }
};

exports.getChallengeLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    
    const leaderboard = challenge.participants
      .sort((a, b) => b.votes - a.votes)
      .map((p, index) => ({
        rank: index + 1,
        userId: p.userId,
        votes: p.votes,
        submittedAt: p.submittedAt
      }));
    
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};