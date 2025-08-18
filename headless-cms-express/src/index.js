const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (config.corsOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(morgan('dev')); // logging requests

// Routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});
