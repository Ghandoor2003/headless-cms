const express = require('express');
const InstanceController = require('../controllers/instance.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validateInstanceData = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * Middleware to attach category by ID
 */
const attachCategoryById = async (req, res, next) => {
  const Category = require('../models/category.model');
  const categoryId = req.params.categoryId;

  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: 'Invalid categoryId' });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: `Category not found` });
    req.category = category;
    next();
  } catch (err) {
    next(err);
  }
};

// Create instance
router.post(
  '/:categoryId',
  authenticateToken(true),
  roleMiddleware('admin', 'editor'),
  attachCategoryById,
  validateInstanceData(),
  InstanceController.createInstance
);

// Update instance
router.put(
  '/:categoryId/:id',
  authenticateToken(true),
  roleMiddleware('admin', 'editor'),
  attachCategoryById,
  validateInstanceData(),
  InstanceController.updateInstance
);

// Delete instance
router.delete(
  '/:categoryId/:id',
  authenticateToken(true),
  roleMiddleware('admin'),
  attachCategoryById,
  InstanceController.deleteInstance
);

// Get single instance
router.get(
  '/:categoryId/:id',
  authenticateToken(),
  attachCategoryById,
  InstanceController.getInstance
);

// Get all instances for a category with optional filters
router.get(
  '/:categoryId',
  authenticateToken(),
  attachCategoryById,
  InstanceController.getInstancesByCategory
);

module.exports = router;
