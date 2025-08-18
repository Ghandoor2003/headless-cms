const express = require('express');
const CategoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Staff only routes
router.post('/', authenticateToken(true), roleMiddleware('admin'), CategoryController.createCategory);
router.put('/:id', authenticateToken(true), roleMiddleware('admin'), CategoryController.updateCategory);
router.delete('/:id', authenticateToken(true), roleMiddleware('admin'), CategoryController.deleteCategory);

// Authenticated users can view categories
router.get('/:id', authenticateToken(), CategoryController.getCategory);
router.get('/', authenticateToken(), CategoryController.getAllCategories);

module.exports = router;
