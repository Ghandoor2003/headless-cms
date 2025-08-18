const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

module.exports = {
  signAccessToken: (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  },

  signRefreshToken: (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }
};
