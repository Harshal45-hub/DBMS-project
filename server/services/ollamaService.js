const axios = require('axios');

class OllamaService {
  constructor() {
    this.apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = 'llama3.2';
    this.isAvailable = false;
  }

  async checkConnection() {
    try {
      console.log('  Connecting to Ollama at:', this.baseUrl);
      const response = await axios.get(`${this.baseUrl}/api/tags`, {
        timeout: 5000
      });
      
      const models = response.data.models || [];
      console.log(`  Found ${models.length} model(s):`, models.map(m => m.name).join(', '));
      
      const hasModel = models.some(m => m.name.includes(this.model));
      
      if (hasModel) {
        this.isAvailable = true;
        console.log(`  ✅ ${this.model} model is available`);
        return true;
      } else {
        console.log(`  ⚠️ ${this.model} model not found. Available models: ${models.map(m => m.name).join(', ')}`);
        console.log(`  💡 Run: ollama pull ${this.model}`);
        this.isAvailable = false;
        return false;
      }
    } catch (error) {
      console.error('  ❌ Ollama connection failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('  💡 Make sure Ollama is running: ollama serve');
      }
      this.isAvailable = false;
      return false;
    }
  }

  async generateResponse(prompt, wardrobeContext = null) {
    try {
      if (!this.isAvailable) {
        await this.checkConnection();
      }

      if (!this.isAvailable) {
        return {
          success: false,
          response: this.getFallbackResponse(prompt),
          fromOllama: false
        };
      }

      const enhancedPrompt = this.enhancePromptWithContext(prompt, wardrobeContext);
      
      const response = await axios.post(this.apiUrl, {
        model: this.model,
        prompt: enhancedPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      }, {
        timeout: 30000
      });

      return {
        success: true,
        response: response.data.response,
        fromOllama: true
      };
    } catch (error) {
      console.error('Ollama API error:', error.message);
      return {
        success: false,
        response: this.getFallbackResponse(prompt),
        fromOllama: false
      };
    }
  }

  enhancePromptWithContext(prompt, wardrobeContext) {
    if (!wardrobeContext) return prompt;

    return `
      You are a personal fashion AI assistant. Here is the user's wardrobe context:
      ${JSON.stringify(wardrobeContext, null, 2)}
      
      User query: ${prompt}
      
      Provide a helpful, stylish, and personalized fashion advice based on their wardrobe.
      Keep the response conversational and friendly. Include specific item recommendations when possible.
    `;
  }

  getFallbackResponse(prompt) {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('outfit') || promptLower.includes('wear')) {
      return "✨ Here's a classic outfit suggestion: Try pairing a neutral top with well-fitted jeans or trousers. Add accessories like a watch or necklace to elevate the look. Want me to suggest something more specific?";
    } 
    else if (promptLower.includes('color')) {
      return "🎨 Great question about colors! Here are some timeless combinations:\n• Navy + White - Always elegant\n• Black + Beige - Sophisticated and modern\n• Pastels + Neutrals - Soft and trendy\n\nWhat colors are you trying to combine?";
    }
    else if (promptLower.includes('trend')) {
      return "🔥 Current fashion trends include:\n• Oversized blazers and jackets\n• Wide-leg trousers\n• Sustainable and vintage pieces\n• Bold accessories\n\nWould you like specific suggestions?";
    }
    
    return "👗 Hi! I'm your AI fashion assistant. I can help you with outfit ideas, style advice, and wardrobe suggestions. Try asking me something like 'Suggest an outfit for a date night' or 'What colors go well with navy?'";
  }
}

module.exports = new OllamaService();