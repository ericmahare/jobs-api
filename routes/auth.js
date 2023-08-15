const express = require('express')
const { login, register } = require('../controllers/authController')

// Router setup
const router = express.Router()

// routes
router.post('/login',login)
router.post('/register',register)

module.exports = router
