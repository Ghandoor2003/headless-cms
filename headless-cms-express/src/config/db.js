const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connects to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cms_db';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
