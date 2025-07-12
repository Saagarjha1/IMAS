const Redis = require('ioredis');
require('dotenv').config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error('❌ REDIS_URL is not set in .env');
  process.exit(1);
}

const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // ✅ Required for Upstash & BullMQ
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
  process.exit(1);
});

module.exports = redisClient;
