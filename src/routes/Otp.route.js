const express = require('express');
const router = express.Router();
const { verifyOtp  , resendOtp , viewOtpTable} = require('../controller/Otp.controller');

router.post('/auth/verify-otp', /* #swagger.tags = ['Otp'] */  verifyOtp);
router.post('/auth/resend-otp', /* #swagger.tags = ['Otp'] */  resendOtp);
router.get('/auth/view-otp', /* #swagger.tags = ['Otp'] */  viewOtpTable);

module.exports = router;