/**
 * Redis cache service for handling cache operations
 */
class CacheService {
  /**
   * Get data from Redis cache
   * @param {Redis} redis - Redis client
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached data or null if not found
   */
  async getCache(redis, key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error( `Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in Redis cache
   * @param {Redis} redis - Redis client
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} - Success status
   */
  async setCache(redis, key, data, ttl = 60) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error( `Error setting cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete cache entry
   * @param {Redis} redis - Redis client
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} - Success status
   */
  async invalidateCache(redis, key) {
    try {
      const deleted = await redis.del(key);
      console.log( `Cache invalidated for key: ${key} (${deleted} keys deleted)`);
      return deleted > 0;
    } catch (error) {
      console.error( `Error invalidating cache for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if Redis is connected
   * @param {Redis} redis - Redis client
   * @returns {boolean} - Connection status
   */
  isConnected(redis) {
    return redis && redis.status === 'ready';
  }

  /**
   * Get cache TTL (Time To Live)
   * @param {Redis} redis - Redis client
   * @param {string} key - Cache key
   * @returns {Promise<number>} - TTL in seconds (-1 if no expiry, -2 if key doesn't exist)
   */
  async getCacheTTL(redis, key) {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Error getting TTL for key ${key}:`, error);
      return -2;
    }
  }

  /**
   * Extend cache expiry
   * @param {Redis} redis - Redis client
   * @param {string} key - Cache key
   * @param {number} ttl - New TTL in seconds
   * @returns {Promise<boolean>} - Success status
   */
  async extendCache(redis, key, ttl) {
    try {
      const result = await redis.expire(key, ttl);
      return result === 1;
    } catch (error) {
      console.error( `Error extending cache for key ${key}:`, error);
      return false;
    }
  }
}

module.exports = new CacheService();