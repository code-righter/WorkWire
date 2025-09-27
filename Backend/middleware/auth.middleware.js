// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import redisClient from '../services/redis.service.js';

const authorize = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Authentication failed: No token provided.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1]; // Extract token

        // 2. Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Check Redis if session still exists
        const session = await redisClient.get(token);
        if (!session) {
            const error = new Error('Session expired or invalid. Please login again.');
            error.statusCode = 401;
            throw error;
        }

        // 4. Attach user payload to request
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            error.statusCode = 401;
            error.message = 'Invalid token.';
        }
        if (error.name === 'TokenExpiredError') {
            error.statusCode = 401;
            error.message = 'Token has expired.';
        }
        next(error);
    }
};

export default authorize;