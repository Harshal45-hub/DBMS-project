const Comment = require('../models/Comment');
const Challenge = require('../models/Challenge');
const ClothingItem = require('../models/ClothingItem');
const OutfitHistory = require('../models/OutfitHistory');

exports.addComment = async (req, res, next) => {
  try {
    const { clothingItemId, outfitId, content, type, userName } = req.body;
    
    const comment = new Comment({
      clothingItemId,
      outfitId,
      userId: req.ip,
      userName: userName || 'Anonymous',
      content,
      type: type || 'comment'
    });
    
    await comment.save();
    
    // Update drip score if it's a vote
    if (type === 'vote') {
      await updateDripScore(clothingItemId || outfitId);
    }
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const comments = await Comment.find({ 
      $or: [{ clothingItemId: itemId }, { outfitId: itemId }]
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

exports.castVote = async (req, res, next) => {
  try {
    const { itemId, voteType } = req.body;
    
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Update drip score based on votes
    const dripChange = voteType === 'drip' ? 2 : -1;
    item.dripScore = Math.max(0, Math.min(100, (item.dripScore || 0) + dripChange));
    await item.save();
    
    const comment = new Comment({
      clothingItemId: itemId,
      userId: req.ip,
      content: `${voteType === 'drip' ? '🔥 Drip' : '❌ Skip'} vote cast`,
      type: 'vote',
      vote: voteType
    });
    await comment.save();
    
    res.json({ success: true, data: { dripScore: item.dripScore } });
  } catch (error) {
    next(error);
  }
};

exports.getSocialFeed = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    // Get recent outfits with most engagement
    const recentOutfits = await OutfitHistory.find()
      .populate('items')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);
    
    // Get trending items (highest drip score)
    const trendingItems = await ClothingItem.find()
      .sort({ dripScore: -1, likes: -1 })
      .limit(10);
    
    // Get recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: {
        outfits: recentOutfits,
        trending: trendingItems,
        activity: recentComments
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.joinChallenge = async (req, res, next) => {
  try {
    const { challengeId, outfitId } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }
    
    const existingParticipant = challenge.participants.find(p => p.userId === req.ip);
    if (existingParticipant) {
      return res.status(400).json({ success: false, error: 'Already joined this challenge' });
    }
    
    challenge.participants.push({
      userId: req.ip,
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

exports.getActiveChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({
      active: true,
      endDate: { $gt: new Date() }
    });
    
    res.json({ success: true, data: challenges });
  } catch (error) {
    next(error);
  }
};

async function updateDripScore(itemId) {
  const votes = await Comment.find({ 
    clothingItemId: itemId, 
    type: 'vote' 
  });
  
  const dripCount = votes.filter(v => v.vote === 'drip').length;
  const skipCount = votes.filter(v => v.vote === 'skip').length;
  
  const totalVotes = dripCount + skipCount;
  if (totalVotes > 0) {
    const dripScore = Math.floor((dripCount / totalVotes) * 100);
    await ClothingItem.findByIdAndUpdate(itemId, { dripScore });
  }
}