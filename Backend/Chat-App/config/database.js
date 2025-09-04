const mongoose = require('mongoose');
const redis = require('redis');

// MongoDB connection configuration
class DatabaseConfig {
    static async connectMongoDB() {
        try {
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';

            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                bufferMaxEntries: 0, // Disable mongoose buffering
                bufferCommands: false, // Disable mongoose buffering
            };

            await mongoose.connect(mongoURI, options);

            console.log('ðŸŸ¢ Connected to MongoDB successfully');

            // Handle connection events
            mongoose.connection.on('connected', () => {
                console.log('ðŸ“Š MongoDB connection established');
            });

            mongoose.connection.on('error', (err) => {
                console.error('âŒ MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('ðŸ“´ MongoDB disconnected');
            });

            return mongoose.connection;
        } catch (error) {
            console.error('âŒ MongoDB connection failed:', error);
            return null;
        }
    }

    static async connectRedis() {
        try {
            const redisConfig = {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                retryDelayOnFailover: 100,
                enableReadyCheck: false,
                maxRetriesPerRequest: null,
            };

            const client = redis.createClient(redisConfig);

            // Error handling
            client.on('error', (err) => {
                console.error('âŒ Redis Client Error:', err);
            });

            client.on('connect', () => {
                console.log('ðŸ”— Redis client connected');
            });

            client.on('ready', () => {
                console.log('ðŸŸ¢ Redis client ready');
            });

            client.on('end', () => {
                console.log('ðŸ“´ Redis client disconnected');
            });

            await client.connect();
            console.log('ðŸŸ¢ Connected to Redis successfully');

            return client;
        } catch (error) {
            console.error('âŒ Redis connection failed:', error);
            return null;
        }
    }

    static async gracefulShutdown(mongoConnection, redisClient) {
        console.log('ðŸ”„ Starting graceful shutdown...');

        try {
            if (redisClient) {
                await redisClient.quit();
                console.log('âœ… Redis connection closed');
            }

            if (mongoConnection) {
                await mongoose.connection.close();
                console.log('âœ… MongoDB connection closed');
            }

            console.log('âœ… Graceful shutdown completed');
        } catch (error) {
            console.error('âŒ Error during shutdown:', error);
        }
    }
}

module.exports = DatabaseConfig;