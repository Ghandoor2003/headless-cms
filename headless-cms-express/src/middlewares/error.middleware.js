/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

/**
 * Centralized error handler
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
};

module.exports = { notFoundHandler, errorHandler };
