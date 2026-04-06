const ShareToken = require('../models/ShareToken');
const ClothingItem = require('../models/ClothingItem');
const Comment = require('../models/Comment');

exports.createShareLink = async (req, res, next) => {
  try {
    const { permissions, wardrobeId } = req.body;
    
    const shareToken = new ShareToken({
      wardrobeId,
      permissions: {
        view: true,
        suggest: permissions?.suggest || false,
        comment: permissions?.comment || false,
        vote: permissions?.vote || false
      }
    });
    
    await shareToken.save();
    
    const shareUrl = `${process.env.CLIENT_URL}/shared/${shareToken.token}`;
    
    res.json({
      success: true,
      data: {
        token: shareToken.token,
        shareUrl,
        expiresAt: shareToken.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSharedWardrobe = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const shareToken = await ShareToken.findOne({ token });
    if (!shareToken) {
      return res.status(404).json({ success: false, error: 'Invalid share link' });
    }
    
    if (shareToken.expiresAt < new Date()) {
      return res.status(410).json({ success: false, error: 'Share link expired' });
    }
    
    const items = await ClothingItem.find();
    
    res.json({
      success: true,
      data: {
        items: shareToken.permissions.view ? items : [],
        permissions: shareToken.permissions,
        token: shareToken.token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.submitSuggestion = async (req, res, next) => {
  try {
    const { token, clothingItemId, suggestion, vote } = req.body;
    
    const shareToken = await ShareToken.findOne({ token });
    if (!shareToken) {
      return res.status(404).json({ success: false, error: 'Invalid share link' });
    }
    
    if (!shareToken.permissions.suggest && !shareToken.permissions.vote) {
      return res.status(403).json({ success: false, error: 'No permission to suggest' });
    }
    
    const comment = new Comment({
      clothingItemId,
      userId: req.ip,
      userName: 'Guest',
      content: suggestion,
      type: vote ? 'vote' : 'suggestion',
      vote
    });
    
    await comment.save();
    
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};