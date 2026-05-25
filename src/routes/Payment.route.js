const express = require('express');
const router = express.Router();
const { createPayment , checkoutTransactions} = require("../controller/payments.controller")

router.post("/payment/:courseId",  /* #swagger.tags = ['Payment'] */  createPayment)
router.post("/payment/checkout/:tranId",  /* #swagger.tags = ['Payment'] */  checkoutTransactions)

module.export = router