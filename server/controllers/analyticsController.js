const ClothingItem = require('../models/ClothingItem');
const OutfitHistory = require('../models/OutfitHistory');
const aiService = require('../services/aiService');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalItems = await ClothingItem.countDocuments();
    const totalOutfits = await OutfitHistory.countDocuments();
    
    const itemsByCategory = await ClothingItem.aggregate([
      { $group: { _id: "$subCategory", count: { $sum: 1 } } }
    ]);
    
    const itemsByColor = await ClothingItem.aggregate([
      { $group: { _id: "$color", count: { $sum: 1 } } }
    ]);
    
    const mostWorn = await ClothingItem.find()
      .sort({ timesWorn: -1 })
      .limit(5);
    
    const leastWorn = await ClothingItem.find()
      .sort({ timesWorn: 1 })
      .limit(5);
    
    // Calculate cost per wear
    const itemsWithCost = await ClothingItem.find({ price: { $gt: 0 } });
    const costPerWear = itemsWithCost.map(item => ({
      name: item.name,
      costPerWear: item.timesWorn > 0 ? (item.price / item.timesWorn).toFixed(2) : item.price
    }));
    
    const aiInsights = await aiService.analyzeWardrobe();
    
    res.json({
      success: true,
      data: {
        overview: {
          totalItems,
          totalOutfits,
          averageDripScore: await getAverageDripScore()
        },
        distribution: {
          byCategory: itemsByCategory,
          byColor: itemsByColor
        },
        usage: {
          mostWorn,
          leastWorn,
          costPerWear: costPerWear.sort((a, b) => a.costPerWear - b.costPerWear)
        },
        aiInsights: aiInsights.aiInsights
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getWearFrequency = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    
    const frequencyData = items.map(item => ({
      name: item.name,
      timesWorn: item.timesWorn,
      lastWorn: item.lastWorn,
      dripScore: item.dripScore
    }));
    
    res.json({
      success: true,
      data: frequencyData
    });
  } catch (error) {
    next(error);
  }
};

exports.getStyleTrends = async (req, res, next) => {
  try {
    const outfits = await OutfitHistory.find()
      .populate('items')
      .sort({ date: -1 })
      .limit(50);
    
    // Analyze trends
    const categoryTrends = {};
    const colorTrends = {};
    
    outfits.forEach(outfit => {
      outfit.items.forEach(item => {
        categoryTrends[item.subCategory] = (categoryTrends[item.subCategory] || 0) + 1;
        colorTrends[item.color] = (colorTrends[item.color] || 0) + 1;
      });
    });
    
    const aiTrends = await aiService.getChatResponse(
      `Analyze these fashion trends: Categories: ${JSON.stringify(categoryTrends)}, Colors: ${JSON.stringify(colorTrends)}. What styles are trending?`
    );
    
    res.json({
      success: true,
      data: {
        popularCategories: Object.entries(categoryTrends).sort((a,b) => b[1] - a[1]),
        popularColors: Object.entries(colorTrends).sort((a,b) => b[1] - a[1]),
        aiAnalysis: aiTrends.response
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSustainabilityMetrics = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    
    const totalWears = items.reduce((sum, item) => sum + (item.timesWorn || 0), 0);
    const avgWearsPerItem = totalWears / items.length;
    
    const sustainabilityScore = Math.min(100, Math.floor((avgWearsPerItem / 50) * 100));
    
    const recommendations = [];
    if (avgWearsPerItem < 20) {
      recommendations.push("Try to wear your items more often to reduce fashion waste");
    }
    if (items.length > 30) {
      recommendations.push("Consider donating or swapping unused items");
    }
    
    res.json({
      success: true,
      data: {
        sustainabilityScore,
        averageWearsPerItem: avgWearsPerItem.toFixed(1),
        totalWears,
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

async function getAverageDripScore() {
  const items = await ClothingItem.find({ dripScore: { $gt: 0 } });
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (item.dripScore || 0), 0);
  return Math.floor(sum / items.length);
}