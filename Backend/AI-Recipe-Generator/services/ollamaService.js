// services/ollamaService.js
const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'tinyllama';
    this.temperature = parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.7;
    this.topP = parseFloat(process.env.OLLAMA_TOP_P) || 0.9;
    
    console.log(`Ollama service configured for model: ${this.model}`);
  }

  // Generates a structured recipe object
  async generateRecipe(ingredients) {
    const prompt = this.createPrompt(ingredients);
    const rawText = await this.getRawOutput(prompt);
    return this.parseResponse(rawText);
  }

  // Fetches raw text output from the model
  async getRawOutput(prompt) {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: this.temperature,
          top_p: this.topP,
        },
      }, { timeout: 45000 }); // Increased timeout for model generation
      return response.data.response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama connection refused. Is the Ollama server running?');
      }
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  // Creates the prompt for Ollama
  createPrompt(ingredients) {
    return `You are a creative chef. Generate a simple recipe based on the following ingredients: ${ingredients.join(', ')}.

Provide your response in the following format, and do not add any extra text or introductions:

TITLE: [A creative and short recipe title]
INGREDIENTS:
- [Ingredient 1]: [Quantity]
- [Ingredient 2]: [Quantity]
STEPS:
1. [First step]
2. [Second step]
3. [Minimum 5 steps total]`;
  }

  // Parses the raw text response into a structured object
  parseResponse(text) {
    const lines = text.split('\n');
    const recipe = { title: '', ingredients: [], steps: [] };
    let currentSection = '';

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        recipe.title = line.substring(6).trim();
      } else if (line.startsWith('INGREDIENTS:')) {
        currentSection = 'ingredients';
      } else if (line.startsWith('STEPS:')) {
        currentSection = 'steps';
      } else if (currentSection === 'ingredients' && line.startsWith('- ')) {
        const [name, quantity] = line.substring(2).split(':');
        if(name) recipe.ingredients.push({ name: name.trim(), quantity: quantity ? quantity.trim() : 'To taste' });
      } else if (currentSection === 'steps' && /^\d+\.\s/.test(line)) {
        recipe.steps.push(line.replace(/^\d+\.\s/, '').trim());
      }
    }
    return recipe;
  }
}

module.exports = new OllamaService();