const InstanceService = require('../services/instance.service');

class InstanceController {
  static async createInstance(req, res, next) {
    try {
      req.body.category = req.category._id;
      const instance = await InstanceService.createInstance(req.body, req.user._id);
      res.status(201).json({ message: 'Instance created', instance });
    } catch (err) {
      next(err);
    }
  }

  static async updateInstance(req, res, next) {
    try {
      req.body.category = req.category._id;
      const instance = await InstanceService.updateInstance(req.params.id, req.body, req.user._id);
      res.json({ message: 'Instance updated', instance });
    } catch (err) {
      next(err);
    }
  }

  static async deleteInstance(req, res, next) {
    try {
      await InstanceService.deleteInstance(req.params.id);
      res.json({ message: 'Instance deleted' });
    } catch (err) {
      next(err);
    }
  }

  static async getInstance(req, res, next) {
    try {
      const instance = await InstanceService.getInstanceById(req.params.id);
      res.json({ instance });
    } catch (err) {
      next(err);
    }
  }

  static async getInstancesByCategory(req, res, next) {
    try {
      const filters = req.query || {};
      const instances = await InstanceService.getInstancesByCategory(req.category._id, filters);
      res.json({ instances });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InstanceController;
