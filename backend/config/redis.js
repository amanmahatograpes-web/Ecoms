const Redis = require('ioredis');
const logger = require('../utils/logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.publisher = null;
    this.subscriber = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const options = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
      };

      // Create main client
      this.client = new Redis(options);

      // Create pub/sub clients
      this.publisher = new Redis(options);
      this.subscriber = new Redis(options);

      // Test connection
      await this.client.ping();
      
      this.isConnected = true;
      logger.info('✅ Redis connected successfully');

      // Handle events
      this.client.on('error', (error) => {
        logger.error(`Redis client error: ${error.message}`);
        this.isConnected = false;
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        logger.info('Redis client ready');
      });

      this.client.on('end', () => {
        this.isConnected = false;
        logger.warn('Redis client disconnected');
      });

      // Setup pub/sub
      this.setupPubSub();

    } catch (error) {
      logger.error(`Redis connection error: ${error.message}`);
      throw error;
    }
  }

  setupPubSub() {
    this.subscriber.on('message', (channel, message) => {
      logger.debug(`Redis message on ${channel}: ${message}`);
      
      // Handle different channels
      switch (channel) {
        case 'price-updates':
          // Process price updates
          break;
        case 'social-shares':
          // Process social shares
          break;
        default:
          logger.debug(`Unhandled Redis channel: ${channel}`);
      }
    });

    // Subscribe to channels
    this.subscriber.subscribe('price-updates', 'social-shares', 'user-activity');
  }

  async set(key, value, expiration = null) {
    try {
      if (expiration) {
        return await this.client.setex(key, expiration, JSON.stringify(value));
      }
      return await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error(`Redis set error for key ${key}: ${error.message}`);
      throw error;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis get error for key ${key}: ${error.message}`);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error(`Redis delete error for key ${key}: ${error.message}`);
      throw error;
    }
  }

  async hset(key, field, value) {
    try {
      return await this.client.hset(key, field, JSON.stringify(value));
    } catch (error) {
      logger.error(`Redis hset error: ${error.message}`);
      throw error;
    }
  }

  async hget(key, field) {
    try {
      const data = await this.client.hget(key, field);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis hget error: ${error.message}`);
      throw error;
    }
  }

  async publish(channel, message) {
    try {
      return await this.publisher.publish(channel, JSON.stringify(message));
    } catch (error) {
      logger.error(`Redis publish error: ${error.message}`);
      throw error;
    }
  }

  async increment(key) {
    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Redis increment error: ${error.message}`);
      throw error;
    }
  }

  async expire(key, seconds) {
    try {
      return await this.client.expire(key, seconds);
    } catch (error) {
      logger.error(`Redis expire error: ${error.message}`);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      await this.publisher.quit();
      await this.subscriber.quit();
      this.isConnected = false;
      logger.info('Redis disconnected');
    } catch (error) {
      logger.error(`Redis disconnect error: ${error.message}`);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  isReady() {
    return this.isConnected && this.client.status === 'ready';
  }
}

module.exports = new RedisClient();