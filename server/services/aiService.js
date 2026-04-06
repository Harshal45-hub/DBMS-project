const ClothingItem = require('../models/ClothingItem');
const OutfitHistory = require('../models/OutfitHistory');
const ollamaService = require('./ollamaService');

class AIService {
  async generateResponse(message, context = null) {
    try {
      // Get wardrobe context for personalized responses
      const wardrobeItems = await ClothingItem.find().limit(10);
      const recentOutfits = await OutfitHistory.find().sort({ date: -1 }).limit(5);
      
      const enhancedContext = {
        wardrobeCount: wardrobeItems.length,
        wardrobeItems: wardrobeItems.map(i => ({ name: i.name, color: i.color, category: i.subCategory })),
        recentOutfits: recentOutfits.map(outfit => outfit.items),
        ...context
      };

      const response = await ollamaService.generateResponse(message, enhancedContext);
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        response: "I'm having trouble connecting to the AI service. Please try again later.",
        fromOllama: false
      };
    }
  }

  async getChatResponse(message, sessionContext = null) {
    return this.generateResponse(message, sessionContext);
  }

  async generateSmartOutfit(occasion = 'casual', excludeItems = []) {
    const availableItems = await ClothingItem.find({
      _id: { $nin: excludeItems }
    });

    if (availableItems.length === 0) {
      return {
        items: [],
        aiExplanation: "Your wardrobe is empty! Add some items first."
      };
    }

    const prompt = `Create a stylish outfit combination for a ${occasion} occasion.
    Available items: ${JSON.stringify(availableItems.map(i => ({ name: i.name, color: i.color, category: i.subCategory })))}
    Consider color coordination, occasion appropriateness, and style trends.
    Suggest 2-4 items that would work well together.`;

    const aiResponse = await ollamaService.generateResponse(prompt);
    
    const suggestedIds = this.parseOutfitSuggestion(aiResponse.response, availableItems);
    
    return {
      items: suggestedIds,
      aiExplanation: aiResponse.response || aiResponse.fallback
    };
  }

  parseOutfitSuggestion(aiResponse, availableItems) {
    const suggestedIds = [];
    for (const item of availableItems) {
      if (aiResponse.toLowerCase().includes(item.name.toLowerCase())) {
        suggestedIds.push(item._id);
        if (suggestedIds.length >= 4) break;
      }
    }
    return suggestedIds;
  }

  async analyzeWardrobe() {
    const items = await ClothingItem.find();
    const categories = {};
    const colors = {};
    
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
      categories[item.subCategory] = (categories[item.subCategory] || 0) + 1;
      colors[item.color] = (colors[item.color] || 0) + 1;
    });

    const prompt = `Analyze this wardrobe data and provide insights:
    - Total items: ${items.length}
    - Categories: ${JSON.stringify(categories)}
    - Colors: ${JSON.stringify(colors)}
    
    Provide fashion insights, suggest items to add, and highlight style strengths.`;

    const aiInsights = await ollamaService.generateResponse(prompt);
    
    return {
      statistics: { total: items.length, categories, colors },
      aiInsights: aiInsights.response || aiInsights.fallback,
      recommendations: this.generateRecommendations(categories, colors)
    };
  }

  generateRecommendations(categories, colors) {
    const recommendations = [];
    
    if (categories['upperwear'] < 5) {
      recommendations.push('Consider adding more upperwear options');
    }
    if (categories['lowerwear'] < 3) {
      recommendations.push('Expand your lowerwear collection');
    }
    
    const colorCount = Object.keys(colors).length;
    if (colorCount < 4) {
      recommendations.push('Add some variety in colors to create more outfit combinations');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your wardrobe looks great! Keep experimenting with new combinations');
    }
    
    return recommendations;
  }

  async getGiftSuggestions(partnerWardrobe) {
    const prompt = `Based on this partner's wardrobe: ${JSON.stringify(partnerWardrobe)},
    Suggest 3 gift items that would complement their style.
    Consider gaps in their wardrobe and current fashion trends.
    Return as JSON with item type, color, reason, and estimated price range.`;

    const response = await ollamaService.generateResponse(prompt);
    
    try {
      const jsonMatch = response.response.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse gift suggestions:', e);
    }
    
    return {
      suggestions: [
        { type: 'upperwear', color: 'neutral', reason: 'Versatile addition', price: 50 },
        { type: 'accessory', color: 'metallic', reason: 'Trendy accent', price: 30 }
      ]
    };
  }

  async rateOutfit(outfitItems, rating, userFeedback) {
    const itemsList = outfitItems.map(item => 
      `${item.name} (${item.color} ${item.subCategory})`
    ).join(', ');

    const prompt = `The user wore this outfit: ${itemsList}. 
    They rated it ${rating}/5. Feedback: ${userFeedback || 'None provided'}.
    Provide style advice on how they could improve this combination or suggest alternatives.`;

    const response = await ollamaService.generateResponse(prompt);
    return response;
  }

  async getStyleAdvice(query, wardrobeContext) {
    const prompt = `Provide fashion and style advice for: ${query}`;
    const response = await ollamaService.generateResponse(prompt, wardrobeContext);
    return response;
  }
}

module.exports = new AIService();