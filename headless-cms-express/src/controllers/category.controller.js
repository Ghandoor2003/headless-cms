const CategoryService = require('../services/category.service');

/**
 * Controller for Category routes
 */
class CategoryController {
  /**
   * Create a new category
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({ message: 'Category created', category });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update an existing category
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async updateCategory(req, res, next) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.json({ message: 'Category updated', category });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a category
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async deleteCategory(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a single category by ID
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getCategory(req, res, next) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      res.json({ category });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all categories
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({ categories });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
