const OutfitHistory = require('../models/OutfitHistory');
const ClothingItem = require('../models/ClothingItem');
const aiService = require('../services/aiService');

exports.generateOutfit = async (req, res, next) => {
  try {
    const { occasion, excludeItems } = req.body;
    
    const recentOutfits = await OutfitHistory.find()
      .sort({ date: -1 })
      .limit(5);
    
    const recentlyWornIds = recentOutfits.flatMap(outfit => 
      outfit.items.map(item => item.toString())
    );
    
    const excludeList = [...(excludeItems || []), ...recentlyWornIds];
    
    const aiSuggestion = await aiService.generateSmartOutfit(occasion, excludeList);
    
    const outfitItems = await ClothingItem.find({
      _id: { $in: aiSuggestion.items }
    });
    
    const outfit = new OutfitHistory({
      items: aiSuggestion.items,
      occasion: occasion || 'casual',
      dripScore: this.calculateDripScore(outfitItems)
    });
    
    await outfit.save();
    
    res.json({
      success: true,
      data: {
        items: outfitItems,
        explanation: aiSuggestion.aiExplanation,
        outfitId: outfit._id
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getOutfitHistory = async (req, res, next) => {
  try {
    const history = await OutfitHistory.find()
      .populate('items')
      .sort({ date: -1 });
    
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

exports.rateOutfit = async (req, res, next) => {
  try {
    const { outfitId, rating, feedback } = req.body;
    
    const outfit = await OutfitHistory.findById(outfitId).populate('items');
    if (!outfit) {
      return res.status(404).json({ success: false, error: 'Outfit not found' });
    }
    
    outfit.rating = rating;
    outfit.feedback = feedback;
    await outfit.save();
    
    const aiFeedback = await aiService.rateOutfit(outfit.items, rating, feedback);
    
    res.json({
      success: true,
      data: outfit,
      aiFeedback: aiFeedback.response
    });
  } catch (error) {
    next(error);
  }
};

function calculateDripScore(items){
  let score = 0;
  items.forEach(item => {
    score += item.dripScore || 0;
  });
  return Math.min(100, Math.floor(score / items.length));
}