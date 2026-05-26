const express = require('express');
const router = express.Router();
const { getMyCertificates, verifyCertificate } = require('../controller/Certificate.controller');
const { protect } = require('../middlewares/authMiddleware'); 


router.get('/certificates/me', protect, getMyCertificates);

router.get('/certificates/verify/:verificationId', verifyCertificate);

module.exports = router;