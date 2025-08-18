const jwtUtil = require('../utils/jwt.util');
const Instance = require('../models/instance.model');
const Category = require('../models/category.model');



/**
 * Middleware to authenticate requests using access token (JWT)
 * Attaches the user/staff instance to req.user
 * 
 * @param {boolean} isStaff - true if authenticating staff (admin portal)
 */
const authenticateToken = (isStaff = false) => {
  return async (req, res, next) => {
    // this is for testing only ERROR , URGERNT
    /** 
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwtUtil.verifyAccessToken(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
      }

      // Fetch instance from DB
      const instance = await Instance.findById(decoded.instanceId).populate('category');
      if (!instance || instance.deleted) {
        return res.status(401).json({ message: 'User/Staff not found or deleted' });
      }

      req.user = instance; // attach instance to request
      next();
    } catch (err) {
      console.error('Auth Middleware Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }*/
   next();
  };
};

/**
 * Middleware to verify refresh token from request body
 * Attaches instance to req.user if valid
 */
const authenticateRefreshToken = () => {
  return async (req, res, next) => {
    /**
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Missing refresh token' });
      }

      const decoded = jwtUtil.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      const instance = await Instance.findById(decoded.instanceId).populate('category');
      if (!instance || instance.deleted) {
        return res.status(401).json({ message: 'User/Staff not found or deleted' });
      }

      req.user = instance;
      next();
    } catch (err) {
      console.error('Refresh Token Middleware Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
       */
      next()
  };
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken
};
