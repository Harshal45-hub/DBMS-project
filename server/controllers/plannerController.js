const OutfitHistory = require('../models/OutfitHistory');
const ClothingItem = require('../models/ClothingItem');

exports.getPlannedOutfits = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const outfits = await OutfitHistory.find(query)
      .populate('items')
      .sort({ date: 1 });
    
    res.json({ success: true, data: outfits });
  } catch (error) {
    next(error);
  }
};

exports.scheduleOutfit = async (req, res, next) => {
  try {
    const { items, date, occasion, notes } = req.body;
    
    // Check for duplicates within 7 days
    const weekAgo = new Date(date);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentOutfit = await OutfitHistory.findOne({
      items: { $in: items },
      date: { $gte: weekAgo }
    });
    
    if (recentOutfit) {
      return res.status(400).json({
        success: false,
        error: 'This outfit combination was worn recently'
      });
    }
    
    const outfit = new OutfitHistory({
      items,
      date: new Date(date),
      occasion,
      notes
    });
    
    await outfit.save();
    
    // Update times worn for items
    for (const itemId of items) {
      await ClothingItem.findByIdAndUpdate(itemId, {
        $inc: { timesWorn: 1 },
        lastWorn: new Date()
      });
    }
    
    res.status(201).json({ success: true, data: outfit });
  } catch (error) {
    next(error);
  }
};

exports.getOutfitSuggestionsForDate = async (req, res, next) => {
  try {
    const { date, occasion } = req.query;
    
    const targetDate = new Date(date);
    const weekBefore = new Date(targetDate);
    weekBefore.setDate(weekBefore.getDate() - 7);
    
    // Get recently worn items to avoid
    const recentOutfits = await OutfitHistory.find({
      date: { $gte: weekBefore }
    });
    
    const recentlyWornIds = recentOutfits.flatMap(outfit => 
      outfit.items.map(id => id.toString())
    );
    
    // Get available items
    const availableItems = await ClothingItem.find({
      _id: { $nin: recentlyWornIds }
    });
    
    // Group by occasion appropriateness
    const suggestions = [];
    const occasionItems = availableItems.filter(item => 
      item.occasion?.includes(occasion || 'casual')
    );
    
    // Create combinations
    for (let i = 0; i < Math.min(3, occasionItems.length); i++) {
      const upperItems = occasionItems.filter(item => item.category === 'upperwear');
      const lowerItems = occasionItems.filter(item => item.category === 'lowerwear');
      
      if (upperItems[i] && lowerItems[i]) {
        suggestions.push({
          items: [upperItems[i], lowerItems[i]],
          description: `${upperItems[i].name} with ${lowerItems[i].name} - Perfect for ${occasion || 'casual'} occasion`,
          compatibility: Math.floor(Math.random() * 30) + 70
        });
      }
    }
    
    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

exports.getWearHistory = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    const outfits = await OutfitHistory.find({
      items: itemId
    }).sort({ date: -1 });
    
    const item = await ClothingItem.findById(itemId);
    
    res.json({
      success: true,
      data: {
        item: item,
        wearHistory: outfits,
        frequency: outfits.length,
        lastWorn: item?.lastWorn
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlySummary = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const outfits = await OutfitHistory.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('items');
    
    // Calculate statistics
    const totalOutfits = outfits.length;
    const uniqueItems = new Set();
    const categoryCount = {};
    
    outfits.forEach(outfit => {
      outfit.items.forEach(item => {
        uniqueItems.add(item._id.toString());
        categoryCount[item.subCategory] = (categoryCount[item.subCategory] || 0) + 1;
      });
    });
    
    const mostWornCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0];
    
    res.json({
      success: true,
      data: {
        month: `${year}-${month}`,
        totalOutfits,
        uniqueItemsWorn: uniqueItems.size,
        mostWornCategory: mostWornCategory?.[0] || 'None',
        outfits: outfits.map(outfit => ({
          date: outfit.date,
          items: outfit.items.map(i => i.name),
          occasion: outfit.occasion
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};