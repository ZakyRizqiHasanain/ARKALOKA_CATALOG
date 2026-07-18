const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    return res.status(statusCode).json({
        message: err.message || "Terjadi kesalahan internal pada server",
        errors: err.errors || null
    });
};

module.exports = errorHandler;
