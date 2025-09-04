const dataService = require('../services/dataService');
const cacheService = require('../services/cacheService');

class ItemController {
  // GET /items - Fetch all items
  async getAllItems(req, res) {
    try {
      console.log('ðŸ“Š Fetching items from database...');
      
      // Simulate database delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const items = await dataService.getAllItems();
      
      console.log( `Retrieved ${items.length} items from database`);
      
      // Cache the data (this will be done by middleware, but we can also set it here)
      const redis = req.app.get('redis');
      await cacheService.setCache(redis, 'items:all', items, 60); // 1 minute TTL
      
      res.json({
        success: true,
        data: items,
        source: 'database',
        timestamp: new Date().toISOString(),
        count: items.length
      });
    } catch (error) {
      console.error('âŒ Error fetching items:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch items',
        message: error.message
      });
    }
  }

  // POST /items - Create a new item
  async createItem(req, res) {
    try {
      const { name, description, price, category } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: 'Name is required'
        });
      }
      
      const newItem = {
        name,
        description: description || '',
        price: price || 0,
        category: category || 'general',
        createdAt: new Date().toISOString()
      };
      
      console.log('âž• Creating new item:', newItem.name);
      
      const createdItem = await dataService.createItem(newItem);
      
      // Invalidate cache after successful creation
      const redis = req.app.get('redis');
      await cacheService.invalidateCache(redis, 'items:all');
      console.log('ðŸ—‘ï¸ Cache invalidated after item creation');
      
      res.status(201).json({
        success: true,
        data: createdItem,
        message: 'Item created successfully'
      });
    } catch (error) {
      console.error('âŒ Error creating item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create item',
        message: error.message
      });
    }
  }

  // PUT /items/:id - Update an item
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log( `Updating item with ID: ${id}`);
      
      const updatedItem = await dataService.updateItem(parseInt(id), updateData);
      
      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          error: 'Item not found',
          message: `Item with ID ${id} does not exist`
        });
      }
      
      // Invalidate cache after successful update
      const redis = req.app.get('redis');
      await cacheService.invalidateCache(redis, 'items:all');
      console.log('ðŸ—‘ï¸ Cache invalidated after item update');
      
      res.json({
        success: true,
        data: updatedItem,
        message: 'Item updated successfully'
      });
    } catch (error) {
      console.error('âŒ Error updating item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update item',
        message: error.message
      });
    }
  }

  // DELETE /items/:id - Delete an item
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      
      console.log( `Deleting item with ID: ${id}`);
      
      const deleted = await dataService.deleteItem(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Item not found',
          message: `Item with ID ${id} does not exist`
        });
      }
      
      // Invalidate cache after successful deletion
      const redis = req.app.get('redis');
      await cacheService.invalidateCache(redis, 'items:all');
      console.log('ðŸ—‘ï¸ Cache invalidated after item deletion');
      
      res.json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      console.error('âŒ Error deleting item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete item',
        message: error.message
      });
    }
  }
}

module.exports = new ItemController();