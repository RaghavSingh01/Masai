// utils/helpers.js

/**
 * Cleans and sanitizes an array of ingredients.
 * It performs the following actions:
 * - Ensures the input is an array.
 * - Converts each ingredient to lowercase.
 * - Trims leading/trailing whitespace from each ingredient.
 * - Removes any empty or nullish entries after trimming.
 * - Removes duplicate ingredients to ensure a unique list.
 *
 * @param {string[]} ingredients - The raw array of ingredient strings from the request.
 * @returns {string[]} A cleaned, unique array of ingredients.
 */
const processIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) {
    console.warn('Input to processIngredients was not an array. Returning empty array.');
    return [];
  }

  const cleanedIngredients = ingredients
    .map(ingredient => typeof ingredient === 'string' ? ingredient.trim().toLowerCase() : '')
    .filter(ingredient => ingredient.length > 0);

  // Use a Set to automatically handle uniqueness, then convert back to an array
  const uniqueIngredients = [...new Set(cleanedIngredients)];

  return uniqueIngredients;
};

module.exports = {
  processIngredients,
};