const Reel = require('../models/Reel');
const OutfitHistory = require('../models/OutfitHistory');
const Notification = require('../models/Notification');

exports.getReelFeed = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reels = await Reel.find()
      .populate('outfitId')
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Reel.countDocuments();
    
    res.json({
      success: true,
      data: {
        reels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrendingReels = async (req, res, next) => {
  try {
    const trending = await Reel.find()
      .populate('outfitId')
      .populate('userId', 'name avatar')
      .sort({ likes: -1, views: -1 })
      .limit(10);
    
    res.json({ success: true, data: trending });
  } catch (error) {
    next(error);
  }
};

exports.getReelById = async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.reelId)
      .populate('outfitId')
      .populate('userId', 'name avatar');
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.createReel = async (req, res, next) => {
  try {
    const { outfitId, videoUrl, title, description, userId } = req.body;
    
    const reel = new Reel({
      outfitId,
      videoUrl,
      title,
      description,
      userId,
      views: 0,
      likes: 0,
      comments: [],
      createdAt: new Date()
    });
    
    await reel.save();
    
    res.status(201).json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.updateReel = async (req, res, next) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.reelId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.deleteReel = async (req, res, next) => {
  try {
    const reel = await Reel.findByIdAndDelete(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    res.json({ success: true, message: 'Reel deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.incrementViews = async (req, res, next) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.reelId,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.likeReel = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    // Check if already liked
    if (reel.likedBy && reel.likedBy.includes(userId)) {
      return res.status(400).json({ success: false, error: 'Already liked' });
    }
    
    reel.likes += 1;
    reel.likedBy = reel.likedBy || [];
    reel.likedBy.push(userId);
    await reel.save();
    
    // Create notification
    const notification = new Notification({
      userId: reel.userId,
      type: 'like',
      title: 'Someone liked your reel!',
      message: 'Your fashion reel got a new like',
      data: { reelId: reel._id }
    });
    await notification.save();
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.unlikeReel = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    reel.likes = Math.max(0, reel.likes - 1);
    reel.likedBy = reel.likedBy.filter(id => id !== userId);
    await reel.save();
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { userId, userName, text } = req.body;
    
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    const comment = {
      userId,
      userName: userName || 'Anonymous',
      text,
      createdAt: new Date()
    };
    
    reel.comments.push(comment);
    await reel.save();
    
    // Create notification
    const notification = new Notification({
      userId: reel.userId,
      type: 'comment',
      title: 'New comment on your reel!',
      message: `${userName || 'Someone'} commented on your reel`,
      data: { reelId: reel._id, commentId: comment._id }
    });
    await notification.save();
    
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    res.json({ success: true, data: reel.comments });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    reel.comments = reel.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );
    await reel.save();
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getUserReels = async (req, res, next) => {
  try {
    const reels = await Reel.find({ userId: req.params.userId })
      .populate('outfitId')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: reels });
  } catch (error) {
    next(error);
  }
};

exports.saveReel = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const reel = await Reel.findById(req.params.reelId);
    
    if (!reel) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    
    reel.savedBy = reel.savedBy || [];
    if (!reel.savedBy.includes(userId)) {
      reel.savedBy.push(userId);
      await reel.save();
    }
    
    res.json({ success: true, data: reel });
  } catch (error) {
    next(error);
  }
};

exports.getSavedReels = async (req, res, next) => {
  try {
    const reels = await Reel.find({ savedBy: req.params.userId })
      .populate('outfitId')
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: reels });
  } catch (error) {
    next(error);
  }
};