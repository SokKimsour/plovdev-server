const express = require('express');
const router = express.Router();

const { approveJob, rejectJob } = require('../controller/Admin.controller');

const authenticate = require('../middlewares/authMiddleWare').authenticateToken;
const isAdmin = require('../middlewares/authMiddleWare').isAdmin


router.patch('/jobs/:id/approve', authenticate, isAdmin, approveJob);

router.patch('/jobs/:id/reject', authenticate, isAdmin, rejectJob);

module.exports = router;