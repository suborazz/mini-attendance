const errorHandler = (err, req, res, next) => {
    console.error('--- INTERNAL SERVER ERROR ---');
    console.error(err.stack);
    console.error('-----------------------------');

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
