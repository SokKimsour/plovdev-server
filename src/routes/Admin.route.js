const express = require('express');
const router = express.Router();

const { approveJob, rejectJob } = require('../controller/Admin.controller');

const authenticate = require('../middlewares/authMiddleware').authenticateToken;
const isAdmin = require('../middlewares/authMiddleware').isAdmin


router.patch('/jobs/:id/approve',  /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, approveJob);

router.patch('/jobs/:id/reject',  /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, rejectJob);

module.exports = router;