const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerificationCode } = require('../controllers/authController');

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

module.exports = router;