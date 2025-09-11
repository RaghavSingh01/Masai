// routes/compare.js
const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');
const geminiService = require('../services/geminiService');
const { validateIngredients } = require('../middleware/validators');
const { processIngredients } = require('../utils/helpers');

/**
 * @route   POST /api/compare-models
 * @desc    Compares the raw output of Ollama and Gemini for a given set of ingredients.
 * @access  Public
 */
router.post('/compare-models', validateIngredients, async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    const processedIngredients = processIngredients(ingredients);

    console.log('🔄 Comparing model outputs for:', processedIngredients.join(', '));

    // Get raw outputs from both services concurrently
    const [ollamaRaw, geminiRaw] = await Promise.all([
      ollamaService.getRawOutput(processedIngredients), // Assumes a getRawOutput method in ollamaService
      geminiService.getRawOutput(processedIngredients)  // Assumes a getRawOutput method in geminiService
    ]);

    res.json({
      success: true,
      comparison: {
        ingredients: processedIngredients,
        ollama: {
          model: ollamaService.model,
          rawOutput: ollamaRaw,
        },
        gemini: {
          model: 'gemini-pro',
          rawOutput: geminiRaw,
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;