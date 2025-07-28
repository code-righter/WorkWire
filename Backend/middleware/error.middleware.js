// middleware/error.middleware.js (create this file)

const errorMiddleware = (err, req, res, next) => {
    // Log the error for debugging purposes (IMPORTANT!)
    console.error("Global Error Handler caught:", err);

    const statusCode = err.statusCode || 500; // Use error.statusCode if available, else 500
    const message = err.message || 'Internal Server Error';

    // Optionally, send more detailed error info in development
    const responseError = {
        success: false,
        message: message,
    };

    if (process.env.NODE_ENV === 'development') {
        responseError.stack = err.stack;
    }

    res.status(statusCode).json(responseError);
};

export default errorMiddleware;