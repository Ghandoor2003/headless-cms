const Instance = require('../models/instance.model')
const Category = require('../models/category.model')
const jwtUtil = require('../utils/jwt.util')
const passwordUtil = require('../utils/password.util')

class AuthService {
  /**
   * Register a new instance in the given category
   * @param {string} categoryName - 'User' or 'Staff'
   * @param {object} data - Fields required by the category (e.g. username, email, password)
   * @returns {Promise<{ accessToken: string, refreshToken: string, user: Instance }>}
   */
  static async register(categoryName, data) {
    if (!categoryName || !data || !data.email || !data.password) {
      const err = new Error('Category, email, and password are required')
      err.statusCode = 400
      throw err
    }

    const category = await Category.findOne({ name: categoryName })
    if (!category) {
      const err = new Error(`${categoryName} category not found`)
      err.statusCode = 404
      throw err
    }

    // Check if email already exists
    const existing = await Instance.findOne({ category: category._id, 'data.email': data.email })
    if (existing) {
      const err = new Error('Email already registered')
      err.statusCode = 400
      throw err
    }

    // Hash password
    data.password = await passwordUtil.hashPassword(data.password)

    const instance = new Instance({
      name: data.username || data.email,
      category: category._id,
      data
    })
    await instance.save()

    const payload = {
      instanceId: instance._id,
      role: instance.data.role || 'user'
    }

    const accessToken = jwtUtil.signAccessToken(payload)
    const refreshToken = jwtUtil.signRefreshToken(payload)

    return { accessToken, refreshToken, user: instance }
  }

  /**
   * Login an instance
   * @param {string} email
   * @param {string} password
   * @param {string} categoryName
   * @returns {Promise<{ accessToken: string, refreshToken: string, user: Instance }>}
   */
  static async login(email, password, categoryName) {
    if (!email || !password || !categoryName) {
      const err = new Error('Email, password, and category are required')
      err.statusCode = 400
      throw err
    }

    const category = await Category.findOne({ name: categoryName })
    if (!category) {
      const err = new Error(`${categoryName} category not found`)
      err.statusCode = 404
      throw err
    }

    const instance = await Instance.findOne({category: category._id,['data.email']: email})
    console.log(Instance)
    console.log(typeof  Instance.data)
    if (!instance) {
      const err = new Error('Invalid credentials : no instance')
      err.statusCode = 401
      throw err
    }
    if (!instance.data.password) {
      const err = new Error('Invalid credentials : instance with no password')
      err.statusCode = 401
      throw err
    }

    const isValid = await passwordUtil.comparePassword(password, instance.data.password)
    if (!isValid) {
      const err = new Error('Invalid credentials : password')
      err.statusCode = 401
      throw err
    }

    const payload = {
      instanceId: instance._id,
      role: instance.data.role || 'user'
    }

    const accessToken = jwtUtil.signAccessToken(payload)
    const refreshToken = jwtUtil.signRefreshToken(payload)

    return { accessToken, refreshToken, user: instance }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise<{ accessToken: string, refreshToken: string }>}
   */
  static async refreshToken(refreshToken) {
    const decoded = jwtUtil.verifyRefreshToken(refreshToken)
    if (!decoded) {
      const err = new Error('Invalid or expired refresh token')
      err.statusCode = 401
      throw err
    }

    const instance = await Instance.findById(decoded.instanceId).populate('category')
    if (!instance || instance.deleted) {
      const err = new Error('Instance not found or deleted')
      err.statusCode = 404
      throw err
    }

    const payload = {
      instanceId: instance._id,
      role: instance.data.role || 'user'
    }

    const newAccessToken = jwtUtil.signAccessToken(payload)
    const newRefreshToken = jwtUtil.signRefreshToken(payload)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}

module.exports = AuthService
