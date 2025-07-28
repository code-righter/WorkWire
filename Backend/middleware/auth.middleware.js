// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const authorize = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        // 2. Check if token exists and has the 'Bearer' prefix
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Authentication failed: No token provided.');
            error.statusCode = 401; // 401 Unauthorized
            throw error;
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

        // 3. Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Attach user payload to the request object
        // The payload is what you signed in the controller: { userId: userExists._id }
        req.user = { userId: decoded.userId };

        // 5. Pass control to the next function (the controller)
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            error.statusCode = 401;
            error.message = 'Invalid token.';
        }
        if (error.name === 'TokenExpiredError') {
            error.statusCode = 401;
            error.message = 'Token has expired.';
        }
        next(error); // Pass error to the global error handler
    }
};

export default authorize;