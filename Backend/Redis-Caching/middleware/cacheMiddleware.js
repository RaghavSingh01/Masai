const cacheService = require('../services/cacheService');

/**
 * Redis caching middleware
 * @param {string} cacheKey - The cache key to use
 * @param {number} ttl - Time to live in seconds (default: 60)
 */
function cacheMiddleware(cacheKey, ttl = 60) {
  return async (req, res, next) => {
    try {
      const redis = req.app.get('redis');
      
      if (!redis) {
        console.warn('âš ï¸ Redis client not available, skipping cache');
        return next();
      }

      // Try to get data from cache
      console.log(`Checking cache for key: ${cacheKey}`);
      const cachedData = await cacheService.getCache(redis, cacheKey);

      if (cachedData) {
        console.log(`Cache HIT for key: ${cacheKey}`);
        return res.json({
          success: true,
          data: cachedData,
          source: 'cache',
          timestamp: new Date().toISOString(),
          count: Array.isArray(cachedData) ? cachedData.length : 1
        });
      }

      console.log( `Cache MISS for key: ${cacheKey}`);

      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode === 200 && data.success && data.data) {
          cacheService.setCache(redis, cacheKey, data.data, ttl)
            .then(() => {
              console.log( `Data cached with key: ${cacheKey}, TTL: ${ttl}s`);
            })
            .catch(err => {
              console.error('âŒ Error caching data:', err);
            });
        }
        
        // Call the original res.json
        originalJson.call(this, data);
      };

      // Continue to the next middleware/controller
      next();
    } catch (error) {
      console.error('âŒ Cache middleware error:', error);
      // Continue without caching on error
      next();
    }
  };
}

module.exports = cacheMiddleware;