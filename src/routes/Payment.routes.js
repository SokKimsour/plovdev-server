const express = require('express');
const router = express.Router();
const { createPayment, checkoutTransactions, handlePaymentWebhook } = require("../controller/Payments.controller");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/payments/initiate", authenticateToken, /* #swagger.tags = ['Payment'] */ createPayment);
router.get("/payments/check-status/:tranId", authenticateToken, /* #swagger.tags = ['Payment'] */ checkoutTransactions);
router.post("/payments/webhook", /* #swagger.tags = ['Payment'] */ handlePaymentWebhook);

module.exports = router;
