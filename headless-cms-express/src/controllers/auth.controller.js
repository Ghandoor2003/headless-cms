const AuthService = require('../services/auth.service')

/**
 * Controller for authentication routes (User & Staff)
 */
class AuthController {
  /**
   * Register endpoint
   */
  static async register(req, res, next) {
    try {
      const { category, ...data } = req.body
      if (!category) return res.status(400).json({ message: 'Category is required' })
      if (!data.email || !data.password) return res.status(400).json({ message: 'Email and password are required' })

      const { accessToken, refreshToken, user } = await AuthService.register(category, data)

      // Remove password hash from response
      const safeUser = { ...user.toObject() }
      if (safeUser.data) delete safeUser.data.password

      res.status(201).json({ message: 'Registration successful', accessToken, refreshToken, user: safeUser })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Login endpoint
   */
  static async login(req, res, next) {
    try {
      const { email, password, category } = req.body
      if (!email || !password || !category) return res.status(400).json({ message: 'Email, password, and category are required' })

      const { accessToken, refreshToken, user } = await AuthService.login(email, password, category)

      // Remove password hash from response
      const safeUser = { ...user.toObject() }
      if (safeUser.data) delete safeUser.data.password

      res.json({ message: 'Login successful', accessToken, refreshToken, user: safeUser })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Refresh access token endpoint
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' })

      const tokens = await AuthService.refreshToken(refreshToken)
      res.json({ message: 'Token refreshed', ...tokens })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AuthController
