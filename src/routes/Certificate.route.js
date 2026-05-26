const express = require('express');
const router = express.Router();
const { getMyCertificates, verifyCertificate } = require('../controller/Certificate.controller');
const { protect } = require('../middlewares/authMiddleware'); 


router.get('/certificates/me', protect, /* #swagger.tags = ['Certificates'] */ getMyCertificates);

router.get('/certificates/verify/:verificationId', /* #swagger.tags = ['Certificates'] */ verifyCertificate);

module.exports = router;