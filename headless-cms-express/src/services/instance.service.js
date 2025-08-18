const mongoose = require('mongoose');
const Instance = require('../models/instance.model');
const Category = require('../models/category.model');

class InstanceService {

  static async createInstance(data, createdBy) {
    const { name, category: categoryId, data: instanceData = {}, relations = [], metaData = {} } = data;

    const category = await Category.findById(categoryId);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }

    if (category.unique) {
      const exists = await Instance.findOne({ category: categoryId });
      if (exists) {
        const err = new Error(`Category "${category.name}" allows only one instance`);
        err.statusCode = 400;
        throw err;
      }
    }

    const instance = new Instance({
      name,
      category: categoryId,
      data: instanceData,
      relations,
      metaData,
      createdBy
    });

    return await instance.save();
  }

  static async updateInstance(instanceId, updates, updatedBy) {
    const instance = await Instance.findById(instanceId);
    if (!instance || instance.deleted) {
      const err = new Error('Instance not found or deleted');
      err.statusCode = 404;
      throw err;
    }

    const category = await Category.findById(instance.category);
    if (!category.changable) {
      const err = new Error('Category is not changable');
      err.statusCode = 403;
      throw err;
    }

    if (updates.data) {
      for (const [key, value] of Object.entries(updates.data)) {
        const field = category.dataFields?.find(f => f.name === key && f.unique);
        if (field) {
          const exists = await Instance.findOne({
            category: category._id,
            [`data.${key}`]: value,
            _id: { $ne: instanceId }
          });
          if (exists) {
            const err = new Error(`Field "${key}" must be unique`);
            err.statusCode = 400;
            throw err;
          }
        }
      }
      instance.data = { ...instance.data, ...updates.data };
    }

    if (updates.relations) instance.relations = updates.relations;
    if (updates.metaData) instance.metaData = updates.metaData;
    if (updates.name) instance.name = updates.name;
    instance.updatedBy = updatedBy;

    return await instance.save();
  }

  static async deleteInstance(instanceId) {
    const instance = await Instance.findById(instanceId);
    if (!instance || instance.deleted) {
      const err = new Error('Instance not found or already deleted');
      err.statusCode = 404;
      throw err;
    }

    instance.deleted = true;
    await instance.save();
  }

  static async getInstanceById(instanceId) {
    const instance = await Instance.findById(instanceId)
      .populate('category')
      .populate('relations.instance');

    if (!instance || instance.deleted) {
      const err = new Error('Instance not found or deleted');
      err.statusCode = 404;
      throw err;
    }

    return instance;
  }

  static async getInstancesByCategory(categoryId, filters = {}) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error('Invalid categoryId');
    }

    const query = { category: new mongoose.Types.ObjectId(categoryId), deleted: false };

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        query[key.startsWith('data.') ? key : `data.${key}`] = filters[key];
      }
    }

    return await Instance.find(query)
      .populate('category')
      .populate('relations.instance')
      .sort({ createdAt: -1 });
  }
}

module.exports = InstanceService;
