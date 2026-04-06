const axios = require('axios');

class OllamaConfig {
  constructor() {
    this.apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
    this.model = 'llama3.2';
  }

  async generate(prompt, options = {}) {
    try {
      const response = await axios.post(`${this.apiUrl}/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.9,
          max_tokens: options.maxTokens || 500
        }
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  async chat(messages, options = {}) {
    try {
      const response = await axios.post(`${this.apiUrl}/chat`, {
        model: this.model,
        messages: messages,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.9
        }
      });
      
      return response.data.message.content;
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw error;
    }
  }

  async checkConnection() {
    try {
      await axios.get(`${this.apiUrl}/tags`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new OllamaConfig();