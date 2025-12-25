const errorMiddleware = (err, req, res, next) => {
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Check for specific error types
    let errorResponse = {
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        errorResponse.message = Object.values(err.errors).map(val => val.message).join(', ');
        errorResponse.statusCode = 400;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        errorResponse.message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
        errorResponse.statusCode = 400;
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        errorResponse.message = `Resource not found with id: ${err.value}`;
        errorResponse.statusCode = 404;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        errorResponse.message = 'Invalid token. Please login again.';
        errorResponse.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        errorResponse.message = 'Token expired. Please login again.';
        errorResponse.statusCode = 401;
    }

    res.status(errorResponse.statusCode || statusCode).json(errorResponse);
};

module.exports = errorMiddleware;