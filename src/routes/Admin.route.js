const express = require('express');
const router = express.Router();

const { getJobs, approveJob, rejectJob, deleteJob } = require('../controller/Admin.controller');

const authenticate = require('../middlewares/authMiddleware').authenticateToken;
const isAdmin = require('../middlewares/authMiddleware').isAdmin;

router.get('/jobs', /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, getJobs);
router.patch('/jobs/:id/approve', /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, approveJob);
router.patch('/jobs/:id/reject', /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, rejectJob);
router.delete('/jobs/:id', /* #swagger.tags = ['Admin'] */ authenticate, isAdmin, deleteJob);

module.exports = router;