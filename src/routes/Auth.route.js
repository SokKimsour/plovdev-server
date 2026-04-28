const express = require('express');
const router = express.Router();
const { register , login , logout , refreshToken , getMe} = require('../controller/Auth.controller');
const { loginLimiter } = require('../middlewares/rateLimits');
const { authenticateToken } = require('../middlewares/authMiddleWare');

router.post('/auth/register', register);
router.post('/auth/refreshtoken', refreshToken);
router.post('/auth/login', loginLimiter , login);
router.post('/auth/logout',   logout);
router.get('/auth/me', authenticateToken , getMe);


module.exports = router;