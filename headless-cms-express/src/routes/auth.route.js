const express = require('express')
const AuthController = require('../controllers/auth.controller')

const router = express.Router()

// Register new instance (User, Staff, etc.)
router.post('/register', AuthController.register)

// Login
router.post('/login', AuthController.login)

// Refresh token
router.post('/refresh', AuthController.refreshToken)

module.exports = router
