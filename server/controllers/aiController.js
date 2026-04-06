const aiService = require('../services/aiService');
const ClothingItem = require('../models/ClothingItem');
const OutfitHistory = require('../models/OutfitHistory');

exports.chat = async (req, res, next) => {
  try {
    const { message, sessionContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    console.log(`💬 AI Chat Request: ${message}`);
    
    const response = await aiService.generateResponse(message, sessionContext);
    
    console.log(`🤖 AI Response: ${response.response?.substring(0, 100)}...`);
    
    res.json({
      success: true,
      data: {
        response: response.response || response.fallback || "I'm here to help with your fashion needs!",
        fromAI: response.fromOllama
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      data: {
        response: "I'm having trouble connecting right now. Please make sure Ollama is running with the llama3.2 model."
      }
    });
  }
};

exports.analyzeWardrobe = async (req, res, next) => {
  try {
    const analysis = await aiService.analyzeWardrobe();
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analyze error:', error);
    next(error);
  }
};

exports.getStyleAdvice = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    const wardrobeItems = await ClothingItem.find().limit(20);
    const wardrobeContext = {
      items: wardrobeItems.map(i => ({ name: i.name, color: i.color, category: i.subCategory })),
      totalItems: wardrobeItems.length
    };
    
    const advice = await aiService.getStyleAdvice(query, wardrobeContext);
    
    res.json({
      success: true,
      data: advice
    });
  } catch (error) {
    next(error);
  }
};