// config/constants.js

const CONSTANTS = {
  // Default Large Language Model (LLM) settings
  LLM_DEFAULTS: {
    OLLAMA_MODEL: 'tinyllama', // Default model for Ollama
    GEMINI_MODEL: 'gemini-pro', // Default model for Gemini
    TEMPERATURE: 0.7,         // Default creativity/randomness level
    TOP_P: 0.9,                 // Default nucleus sampling value
    MAX_OUTPUT_TOKENS: 500,     // Max tokens to generate
  },

  // API and Server configurations
  API: {
    DEFAULT_PORT: 3000,
    HISTORY_PAGINATION_LIMIT: 20, // Default number of items per page for history
  },

  // Application-specific messages
  MESSAGES: {
    SERVER_RUNNING: (port) => `🚀 Server running on port ${port}`,
    HEALTH_CHECK_OK: 'OK',
    ROUTE_NOT_FOUND: 'Route not found',
    RECIPE_GENERATION_SUCCESS: 'Recipe generated successfully',
    RECIPE_GENERATION_FAILURE: 'Failed to generate recipe',
    PDF_GENERATION_SUCCESS: 'PDF generated successfully',
    PDF_GENERATION_FAILURE: 'Failed to generate PDF',
    OLLAMA_CONNECTION_ERROR: 'Ollama server is not running. Please start Ollama and pull a model.',
    GEMINI_API_KEY_MISSING: '⚠ Gemini API key not found. Some features may not work.',
  },

  // File paths and directories
  PATHS: {
    PDF_STORAGE: './storage/pdfs',
    RECIPE_HISTORY_FILE: './storage/recipe_history.json',
  },
};

module.exports = CONSTANTS;