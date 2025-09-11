// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Enhancement service will be disabled.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async enhanceRecipe(baseRecipe, ingredients) {
    if (!this.model) {
      return { ...baseRecipe, nutrition: null }; // Return base if Gemini is disabled
    }
    const prompt = this.createEnhancementPrompt(baseRecipe, ingredients);
    const rawText = await this.getRawOutput(prompt);
    return this.parseEnhancementResponse(rawText, baseRecipe);
  }

  async getRawOutput(prompt) {
     if (!this.model) return "Gemini service is not available.";
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  createEnhancementPrompt(baseRecipe, ingredients) {
    return `You are a helpful cooking assistant. Take the following basic recipe and improve it.
Base recipe title: "${baseRecipe.title}"
Ingredients: ${ingredients.join(', ')}
Base steps: ${baseRecipe.steps.join('; ')}

Your task:
1. Rewrite the cooking steps to be more detailed, clear, and user-friendly. Keep at least 5 steps.
2. Estimate the nutritional information (calories, protein, fat, carbs) for the entire dish.

Provide your response in the following format ONLY:

REWRITTEN_STEPS:
1. [First detailed step]
2. [Second detailed step]
...
NUTRITION:
- Calories: [number] kcal
- Protein: [number] g
- Fat: [number] g
- Carbs: [number] g`;
  }
  
  parseEnhancementResponse(text, baseRecipe) {
    const enhancedData = { steps: baseRecipe.steps, nutrition: null };
    const lines = text.split('\n');
    let currentSection = '';
    const newSteps = [];

    for (const line of lines) {
      if (line.startsWith('REWRITTEN_STEPS:')) currentSection = 'steps';
      else if (line.startsWith('NUTRITION:')) currentSection = 'nutrition';
      else if (currentSection === 'steps' && /^\d+\.\s/.test(line)) {
        newSteps.push(line.replace(/^\d+\.\s/, '').trim());
      } else if (currentSection === 'nutrition' && line.includes(':')) {
        if (!enhancedData.nutrition) enhancedData.nutrition = {};
        const [key, value] = line.replace('-', '').split(':');
        if (key && value) enhancedData.nutrition[key.trim().toLowerCase()] = value.trim();
      }
    }

    if (newSteps.length > 0) {
      enhancedData.steps = newSteps;
    }
    
    return enhancedData;
  }
}

module.exports = new GeminiService();