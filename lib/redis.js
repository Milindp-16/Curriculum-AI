import Redis from 'ioredis';

// Connects to the redis database and provides all redis functionalities on top of it
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(redisUrl);

redis.on('connect', () => console.log('Connected to Redis!'));
redis.on('error', (err) => console.log('Redis Client Error', err));

export default redis;