const Redis = require("ioredis");

// Provide a default that works locally, but use REDIS_URL for production
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(redisUrl, {
    // Optional: add retry strategy so it doesn't crash immediately if disconnected
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on("connect", () => {
    console.log("Connected to Redis Server!");
});

module.exports = redis;