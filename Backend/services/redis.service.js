import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),  // Convert to number
    password: process.env.REDIS_PASSWORD
}); 

redisClient.on('connect', () => {
    console.log("Redis Connected");
});

export default redisClient;
