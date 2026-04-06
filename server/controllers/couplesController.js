const ClothingItem = require('../models/ClothingItem');
const GiftSuggestion = require('../models/GiftSuggestion');
const aiService = require('../services/aiService');
const ShareToken = require('../models/ShareToken');

exports.pairWardrobes = async (req, res, next) => {
  try {
    const { partnerToken } = req.body;
    
    // Validate partner's share token
    const partnerShare = await ShareToken.findOne({ token: partnerToken });
    if (!partnerShare) {
      return res.status(404).json({ success: false, error: 'Invalid partner token' });
    }
    
    // Create couple pair token
    const coupleToken = new ShareToken({
      wardrobeId: 'couple_' + Date.now(),
      permissions: { view: true, suggest: true, comment: true }
    });
    await coupleToken.save();
    
    res.json({
      success: true,
      data: {
        coupleToken: coupleToken.token,
        partnerWardrobeId: partnerShare.wardrobeId
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCoupleSuggestions = async (req, res, next) => {
  try {
    const { partnerWardrobeId } = req.params;
    
    // Get both wardrobes
    const myWardrobe = await ClothingItem.find();
    const partnerWardrobe = await ClothingItem.find(); // In real app, filter by partner ID
    
    // Generate couple outfit suggestions
    const suggestions = [];
    
    // Find complementary colors
    const myColors = [...new Set(myWardrobe.map(i => i.color))];
    const partnerColors = [...new Set(partnerWardrobe.map(i => i.color))];
    
    // Generate AI suggestions for couple outfits
    const prompt = `Suggest 3 couple outfits using these wardrobe items:
    My wardrobe: ${myWardrobe.map(i => i.name).join(', ')}
    Partner's wardrobe: ${partnerWardrobe.map(i => i.name).join(', ')}
    Consider color coordination and style compatibility.`;
    
    const aiResponse = await aiService.getChatResponse(prompt);
    
    suggestions.push({
      type: 'ai_generated',
      description: aiResponse.response,
      compatibility: Math.floor(Math.random() * 30) + 70 // Random 70-100%
    });
    
    res.json({
      success: true,
      data: {
        suggestions,
        compatibility: {
          colorHarmony: myColors.filter(c => partnerColors.includes(c)).length,
          styleMatch: 'good'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.planDateNight = async (req, res, next) => {
  try {
    const { occasion, location, weather } = req.body;
    
    const myWardrobe = await ClothingItem.find();
    
    const prompt = `Plan a date night outfit for a ${occasion || 'romantic'} date.
    Location: ${location || 'restaurant'}
    Weather: ${weather || 'pleasant'}
    Available items: ${myWardrobe.map(i => `${i.name} (${i.color})`).join(', ')}
    
    Suggest a complete outfit with accessories and provide styling tips.`;
    
    const aiResponse = await aiService.getChatResponse(prompt);
    
    // Generate gift suggestions based on partner's style
    const giftSuggestions = await aiService.getGiftSuggestions(myWardrobe);
    
    res.json({
      success: true,
      data: {
        outfitSuggestion: aiResponse.response,
        giftSuggestions: giftSuggestions.suggestions || [],
        tips: [
          "Accessorize with statement pieces",
          "Choose comfortable yet stylish shoes",
          "Layer for versatility"
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getGiftSuggestions = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    
    const partnerWardrobe = await ClothingItem.find(); // Filter by partner ID in real app
    const suggestions = await aiService.getGiftSuggestions(partnerWardrobe);
    
    const giftSuggestion = new GiftSuggestion({
      partnerWardrobeId: partnerId,
      suggestedItems: suggestions.suggestions || []
    });
    await giftSuggestion.save();
    
    res.json({
      success: true,
      data: {
        suggestions: suggestions.suggestions,
        reasoning: suggestions.reasoning,
        priceRange: "$30-$100"
      }
    });
  } catch (error) {
    next(error);
  }
};