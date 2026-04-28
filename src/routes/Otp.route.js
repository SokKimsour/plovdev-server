const express = require('express');
const router = express.Router();
const { verifyOtp  , resendOtp} = require('../controller/Otp.controller');

router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/resend-otp', resendOtp);

module.exports = router;