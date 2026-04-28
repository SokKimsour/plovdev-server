const express = require('express');
const router = express.Router();
const { verifyOtp } = require('../controller/Otp.controller');

router.post('/verify-otp', verifyOtp);

module.exports = router;