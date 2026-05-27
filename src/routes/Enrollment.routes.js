const express = require('express');
const router = express.Router();
const { getMyEnrolledCourses, getAllEnrollments } = require('../controller/Enrollment.controller');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleWare');

// STUDENT ROUTE
router.get('/my-courses', authenticateToken, /* #swagger.tags = ['Enrollment'] */ getMyEnrolledCourses);

// ADMIN ROUTES
router.get('/admin', authenticateToken, isAdmin, /* #swagger.tags = ['Enrollment'] */ getAllEnrollments);

module.exports = router;
