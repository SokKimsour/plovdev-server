const express = require('express');
const router = express.Router();

const {createCourse , viewCourse , viewCourseById}   = require("../controller/Courses.controller");
const { authenticateToken, isTeacher } = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer")   

router.post('/courses', authenticateToken, isTeacher, upload.single('thumbnail'), createCourse); // teacher
router.get('/courses', viewCourse); // student
router.get('/courses/:courseId', viewCourseById); // student

module.exports = router;