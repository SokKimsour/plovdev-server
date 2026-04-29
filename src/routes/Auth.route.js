const express = require('express');
const router = express.Router();
const { register , login , logout , refreshToken , getMe , forgotPassword , verifyForgotOtp , resetPassword} = require('../controller/Auth.controller');
const { loginLimiter } = require('../middlewares/rateLimits');
const { authenticateToken } = require('../middlewares/authMiddleWare');

router.post('/auth/register', register);
router.post('/auth/refreshtoken', refreshToken);
router.post('/auth/login', loginLimiter , login);
router.post('/auth/logout',   logout);
router.get('/users/me', authenticateToken , getMe);

router.post('/auth/forgot-password', forgotPassword)
router.post('/auth/verify-forgot-otp', verifyForgotOtp)
router.post('/auth/reset-password', resetPassword)


module.exports = router;