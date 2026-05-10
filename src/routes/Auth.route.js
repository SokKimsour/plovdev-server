const express = require('express');
const router = express.Router();
const { register , login , logout , refreshToken , getMe , forgotPassword , verifyForgotOtp , resetPassword , changePassword , loginOrSignInWIthGoogle} = require('../controller/Auth.controller');
const { loginLimiter } = require('../middlewares/rateLimits');
const { authenticateToken } = require('../middlewares/authMiddleWare');
const passport = require('passport');

router.post('/auth/register', /* #swagger.tags = ['Auth'] */  register);
router.post('/auth/refreshtoken',  /* #swagger.tags = ['Auth'] */  refreshToken);
router.post('/auth/login',  /* #swagger.tags = ['Auth'] */  loginLimiter , login);
router.post('/auth/logout',  /* #swagger.tags = ['Auth'] */   logout);
router.get('/users/me'  /* #swagger.tags = ['Auth'] */, authenticateToken , getMe);

// login with google
router.get("/auth/google/callback" ,  /* #swagger.tags = ['Auth'] */  passport.authenticate('google', { scope: ['profile', 'email']  , session: false, failureRedirect: '/http://localhost:5173/login' }) , loginOrSignInWIthGoogle)

router.post('/auth/change-password',  /* #swagger.tags = ['Auth'] */ authenticateToken ,changePassword)  ;

router.post('/auth/forgot-password',   /* #swagger.tags = ['Auth'] */  forgotPassword)
router.post('/auth/verify-forgot-otp',  /* #swagger.tags = ['Auth'] */  verifyForgotOtp)
router.post('/auth/reset-password',  /* #swagger.tags = ['Auth'] */ resetPassword)

module.exports = router;