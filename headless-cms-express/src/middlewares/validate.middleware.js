const Category = require('../models/category.model');
const Instance = require('../models/instance.model');

/**
 * Middleware to validate instance data against its category definition
 * 
 * @param {string} categoryParam - Field name in req.body containing category ID
 */
const validateInstanceData = (categoryParam = 'category') => {
  return async (req, res, next) => {
    try {
      const categoryId = req.body[categoryParam];
      if (!categoryId) {
        return res.status(400).json({ message: 'Missing category ID' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }

      const data = req.body.data || {};
      const errors = [];

      for (const field of category.dataFields) {
        const value = data[field.name];

        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
          errors.push(`Field "${field.name}" is required`);
          continue;
        }

        // Skip validation if value is empty and not required
        if (value === undefined || value === null || value === '') continue;

        // Type validation
        switch (field.type) {
          case 'string':
          case 'richtext':
            if (typeof value !== 'string') errors.push(`Field "${field.name}" must be a string`);
            break;
          case 'number':
            if (typeof value !== 'number') errors.push(`Field "${field.name}" must be a number`);
            break;
          case 'boolean':
            if (typeof value !== 'boolean') errors.push(`Field "${field.name}" must be a boolean`);
            break;
          case 'date':
            if (isNaN(Date.parse(value))) errors.push(`Field "${field.name}" must be a valid date`);
            break;
          case 'relation':
            if (!value) {
              errors.push(`Field "${field.name}" must be a valid relation`);
            } else {
              const related = await Instance.findById(value);
              if (!related) errors.push(`Related instance not found for field "${field.name}"`);
            }
            break;
          case 'image':
            if (typeof value !== 'string') errors.push(`Field "${field.name}" must be a valid image URL`);
            break;
          default:
            errors.push(`Unknown type for field "${field.name}"`);
        }

        // Unique validation
        if (field.unique) {
          const exists = await Instance.findOne({
            category: category._id,
            [`data.${field.name}`]: value
          });
          if (exists) errors.push(`Field "${field.name}" must be unique`);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }

      req.category = category; // attach category for downstream usage
      next();
    } catch (err) {
      console.error('[Validate Middleware Error]', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = validateInstanceData;
