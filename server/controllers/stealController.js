const StealHistory = require('../models/StealHistory');
const ClothingItem = require('../models/ClothingItem');
const Notification = require('../models/Notification');

exports.stealOutfit = async (req, res, next) => {
  try {
    const { userId, outfitId, items } = req.body;
    
    const steal = new StealHistory({
      userId,
      originalOutfitId: outfitId,
      stolenItems: items,
      stolenAt: new Date()
    });
    
    await steal.save();
    
    // Create notification for original owner
    const notification = new Notification({
      userId: 'original-user', // In real app, get from outfit
      type: 'steal',
      title: 'Someone Stole Your Fit!',
      message: 'Another user stole your outfit combination',
      data: { stealId: steal._id }
    });
    await notification.save();
    
    res.status(201).json({ success: true, data: steal });
  } catch (error) {
    next(error);
  }
};

exports.getPopularOutfits = async (req, res, next) => {
  try {
    const popular = await StealHistory.aggregate([
      { $group: { _id: '$originalOutfitId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.json({ success: true, data: popular });
  } catch (error) {
    next(error);
  }
};

exports.getUserSteals = async (req, res, next) => {
  try {
    const steals = await StealHistory.find({ userId: req.params.userId })
      .populate('stolenItems')
      .sort({ stolenAt: -1 });
    
    res.json({ success: true, data: steals });
  } catch (error) {
    next(error);
  }
};

exports.likeSteal = async (req, res, next) => {
  try {
    const steal = await StealHistory.findByIdAndUpdate(
      req.params.outfitId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    res.json({ success: true, data: steal });
  } catch (error) {
    next(error);
  }
};