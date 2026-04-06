const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const ollamaService = require('../services/ollamaService');

router.post('/chat', aiController.chat);
router.get('/analyze', aiController.analyzeWardrobe);
router.get('/advice', aiController.getStyleAdvice);

// Add status endpoint to check Ollama
router.get('/status', async (req, res) => {
  const isConnected = await ollamaService.checkConnection();
  res.json({
    success: true,
    data: {
      ollama: isConnected,
      model: ollamaService.model,
      apiUrl: ollamaService.apiUrl
    }
  });
});

module.exports = router;