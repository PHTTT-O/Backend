const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // default
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;