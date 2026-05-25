const express = require('express');
const router = express.Router();
const { createPayment, checkoutTransactions } = require("../controller/payments.controller");
const { authenticateToken } = require("../middlewares/authMiddleWare");

router.post("/payments/initiate", authenticateToken, /* #swagger.tags = ['Payment'] */ createPayment);
router.get("/payments/check-status/:tranId", authenticateToken, /* #swagger.tags = ['Payment'] */ checkoutTransactions);

module.exports = router;
