const Category = require('../models/category.model');

/**
 * Service to handle category-related business logic
 */
class CategoryService {
  /**
   * Create a new category
   * @param {Object} data - Category data
   * @returns {Promise<Category>}
   */
  static async createCategory(data) {
    // Check if category name already exists
    const exists = await Category.findOne({ name: data.name });
    if (exists) {
      const err = new Error('Category name already exists');
      err.statusCode = 400;
      throw err;
    }

    const category = new Category(data);
    return await category.save();
  }

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Category>}
   */
  static async updateCategory(id, updates) {
    const category = await Category.findById(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }

    if (!category.changable) {
      const err = new Error('Category is not changable');
      err.statusCode = 403;
      throw err;
    }

    Object.assign(category, updates);
    return await category.save();
  }

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise<void>}
   */
  static async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }

    if (!category.deletable) {
      const err = new Error('Category cannot be deleted');
      err.statusCode = 403;
      throw err;
    }

    await category.deleteOne();
  }

  /**
   * Get a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Category>}
   */
  static async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return category;
  }

  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  static async getAllCategories() {
    return await Category.find().sort({ createdAt: -1 });
  }
}

module.exports = CategoryService;
