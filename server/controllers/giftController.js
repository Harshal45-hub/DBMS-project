const GiftSuggestion = require('../models/GiftSuggestion');
const aiService = require('../services/aiService');

exports.getGiftSuggestions = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const partnerWardrobe = await ClothingItem.find(); // In real app, filter by partner
    
    const suggestions = await aiService.getGiftSuggestions(partnerWardrobe);
    
    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

exports.purchaseGift = async (req, res, next) => {
  try {
    const { giftId, userId, recipientId } = req.body;
    
    const purchase = new GiftPurchase({
      giftId,
      userId,
      recipientId,
      purchasedAt: new Date()
    });
    
    await purchase.save();
    
    res.json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
};

exports.getGiftHistory = async (req, res, next) => {
  try {
    const history = await GiftPurchase.find({ userId: req.params.userId })
      .populate('giftId')
      .sort({ purchasedAt: -1 });
    
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};