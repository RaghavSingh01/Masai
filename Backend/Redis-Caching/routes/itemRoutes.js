const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const cacheMiddleware = require('../middleware/cacheMiddleware');

// GET /items - Fetch all items with caching
router.get('/items', cacheMiddleware('items:all'), itemController.getAllItems);

// POST /items - Create a new item (invalidates cache)
router.post('/items', itemController.createItem);

// PUT /items/:id - Update an item by ID (invalidates cache)
router.put('/items/:id', itemController.updateItem);

// DELETE /items/:id - Delete an item by ID (invalidates cache)
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;