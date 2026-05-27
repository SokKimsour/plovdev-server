const express = require('express')
const router = express.Router()
const { handleTelegramWebhook } = require('../controller/Telegram.controller')
const env = require('dotenv').config()
// Instead of building the path at load time,
// we check the secret at request time inside the handler.
// This means it reads from process.env on every request,
// not just once when the file first loads.
router.post('/:secret',  /* #swagger.tags = ['Job-board'] */  (req, res, next) => {
  if (req.params.secret !== process.env.TELEGRAM_WEBHOOK_URL) {
    return res.status(404).json({ message: 'Not found' })
  }
  next()
}, handleTelegramWebhook)

module.exports = router