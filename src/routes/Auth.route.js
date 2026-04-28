const express = require('express');
const router = express.Router();
const { register } = require('../controller/Auth.controller');

router.post('/register', register);

module.exports = router;