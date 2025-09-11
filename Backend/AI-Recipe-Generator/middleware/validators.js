// middleware/validators.js
const Joi = require('joi');

// Schema for validating the ingredients input
const ingredientsSchema = Joi.object({
  ingredients: Joi.array()
    .items(Joi.string().trim().min(2).required())
    .min(1)
    .required()
    .messages({
      'array.base': '"ingredients" must be an array.',
      'array.min': '"ingredients" must contain at least one ingredient.',
      'string.empty': 'Ingredient cannot be an empty string.',
      'string.min': 'Each ingredient must be at least 2 characters long.',
      'any.required': '"ingredients" is a required field.',
    }),
});

// Middleware function to validate against the schema
const validateIngredients = (req, res, next) => {
  const { error } = ingredientsSchema.validate(req.body);

  if (error) {
    // If validation fails, send a 400 Bad Request response with the error details
    return res.status(400).json({
      success: false,
      error: 'Invalid input.',
      details: error.details.map((detail) => detail.message).join(', '),
    });
  }

  // If validation passes, move to the next middleware or route handler
  next();
};

module.exports = {
  validateIngredients,
};