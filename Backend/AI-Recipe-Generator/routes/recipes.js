// routes/recipes.js
const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');
const geminiService = require('../services/geminiService');
const pdfService = require('../services/pdfService');
const { validateIngredients } = require('../middleware/validators');
const { processIngredients } = require('../utils/helpers');

// In-memory storage for recipe history, as per assignment instructions.
// For a production app, you would replace this with a database.
const recipeHistory = [];

/**
 * @route   POST /api/generate-recipe
 * @desc    Generates a new recipe from a list of ingredients.
 * @access  Public
 */
router.post('/generate-recipe', validateIngredients, async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    const processedIngredients = processIngredients(ingredients);
    
    console.log('🥘 Generating recipe for:', processedIngredients.join(', '));
    
    // 1. Ollama: Generate the base recipe (title, ingredients, initial steps)
    const ollamaResponse = await ollamaService.generateRecipe(processedIngredients);
    
    // 2. Gemini: Enhance the recipe (rewrite steps, add nutrition)
    const geminiResponse = await geminiService.enhanceRecipe(ollamaResponse, processedIngredients);
    
    // 3. Combine the results into a final recipe object
    const finalRecipe = {
      id: `recipe_${Date.now()}`,
      title: ollamaResponse.title || 'A Delicious Creation',
      ingredients: ollamaResponse.ingredients,
      steps: geminiResponse.steps, // Use the enhanced steps from Gemini
      nutrition: geminiResponse.nutrition, // Use nutrition info from Gemini
      createdAt: new Date().toISOString(),
      modelsUsed: {
        base: ollamaService.model,
        enhancer: geminiService.model ? 'gemini-pro' : 'none'
      }
    };
    
    // Add the new recipe to the top of the history
    recipeHistory.unshift(finalRecipe);
    if (recipeHistory.length > 50) { // Limit history to the last 50 recipes
      recipeHistory.pop();
    }
    
    console.log('✅ Recipe generated successfully:', finalRecipe.title);
    res.status(201).json({ success: true, recipe: finalRecipe });

  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

/**
 * @route   GET /api/history
 * @desc    Retrieves previously generated recipes.
 * @access  Public
 */
router.get('/history', (req, res) => {
  res.json({ success: true, history: recipeHistory });
});

/**
 * @route   POST /api/export-pdf
 * @desc    Exports a specific recipe as a PDF file.
 * @access  Public
 */
router.post('/export-pdf', async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ success: false, error: 'Recipe ID is required.' });
    }

    const recipe = recipeHistory.find(r => r.id === recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found.' });
    }
    
    console.log(`📄 Generating PDF for recipe: ${recipe.title}`);
    const pdfBuffer = await pdfService.generatePdfFromRecipe(recipe);
    
    // Set headers to trigger a file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${recipe.title.replace(/\s/g, '_')}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    next(error);
  }
});

module.exports = router;