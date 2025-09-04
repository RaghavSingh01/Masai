const fs = require('fs').promises;
const path = require('path');

/**
 * Data service that simulates a database using JSON file storage
 */
class DataService {
  constructor() {
    this.dataFile = path.join(__dirname, '../data/items.json');
    this.idCounter = 1;
    this.initializeData();
  }

  /**
   * Initialize data file with sample data if it doesn't exist
   */
  async initializeData() {
    try {
      await fs.access(this.dataFile);
      // File exists, load the current max ID
      const items = await this.loadItems();
      if (items.length > 0) {
        this.idCounter = Math.max(...items.map(item => item.id)) + 1;
      }
    } catch (error) {
      // File doesn't exist, create it with sample data
      console.log('ðŸ“„ Initializing data file with sample data...');
      const sampleData = [
        {
          id: 1,
          name: "Laptop",
          description: "High-performance laptop for development",
          price: 999.99,
          category: "electronics",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Coffee Mug",
          description: "Ceramic mug for your morning coffee",
          price: 15.99,
          category: "kitchen",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Notebook",
          description: "Spiral notebook for taking notes",
          price: 5.99,
          category: "office",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse",
          price: 29.99,
          category: "electronics",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 5,
          name: "Desk Lamp",
          description: "Adjustable LED desk lamp",
          price: 45.00,
          category: "furniture",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      await this.saveItems(sampleData);
      this.idCounter = 6;
    }
  }

  /**
   * Load items from JSON file
   * @returns {Promise<Array>} - Array of items
   */
  async loadItems() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('âŒ Error loading items:', error);
      return [];
    }
  }

  /**
   * Save items to JSON file
   * @param {Array} items - Items to save
   * @returns {Promise<boolean>} - Success status
   */
  async saveItems(items) {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dataFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      await fs.writeFile(this.dataFile, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      console.error('âŒ Error saving items:', error);
      return false;
    }
  }

  /**
   * Get all items
   * @returns {Promise<Array>} - All items
   */
  async getAllItems() {
    return await this.loadItems();
  }

  /**
   * Get item by ID
   * @param {number} id - Item ID
   * @returns {Promise<Object|null>} - Item or null if not found
   */
  async getItemById(id) {
    const items = await this.loadItems();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Create a new item
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} - Created item
   */
  async createItem(itemData) {
    const items = await this.loadItems();
    
    const newItem = {
      id: this.idCounter++,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    await this.saveItems(items);
    
    return newItem;
  }

  /**
   * Update an item
   * @param {number} id - Item ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} - Updated item or null if not found
   */
  async updateItem(id, updateData) {
    const items = await this.loadItems();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }
    
    // Update the item
    items[itemIndex] = {
      ...items[itemIndex],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    await this.saveItems(items);
    return items[itemIndex];
  }

  /**
   * Delete an item
   * @param {number} id - Item ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteItem(id) {
    const items = await this.loadItems();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === initialLength) {
      return false; // Item not found
    }
    
    await this.saveItems(filteredItems);
    return true;
  }

  /**
   * Search items by name or category
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Matching items
   */
  async searchItems(query) {
    const items = await this.loadItems();
    const lowercaseQuery = query.toLowerCase();
    
    return items.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      (item.description && item.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get items by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} - Items in category
   */
  async getItemsByCategory(category) {
    const items = await this.loadItems();
    return items.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
}

module.exports = new DataService();