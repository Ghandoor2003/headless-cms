const express = require('express');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');
const instanceRoutes = require('./instance.route');

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Dynamic instance routes for all categories
router.use('/instances', instanceRoutes);

module.exports = router;
