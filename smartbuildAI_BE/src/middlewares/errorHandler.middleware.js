// 404 handler dùng cho cuối cùng của routes
const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not found' });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = {
  notFound,
  errorHandler
};

