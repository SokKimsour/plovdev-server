const express = require('express');
const router = express.Router();

const {createCourse ,  updateCourse , deleteCourse, publishCourse, viewCourse , viewCourseById , getTeacherCourses}   = require("../controller/Course.controller");
const { authenticateToken, isTeacher , isAdmin} = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer")   

router.post('/course', authenticateToken, isTeacher, upload.single('thumbnail'), createCourse); // teacher
router.put('/course/:courseId', authenticateToken, isTeacher, upload.single('thumbnail'), updateCourse); // teacher
router.delete('/course/:courseId', authenticateToken, isTeacher ,isAdmin, deleteCourse); // admin
router.post('/course/:courseId/publish', authenticateToken, isTeacher, publishCourse);
router.get('/course/me', authenticateToken, getTeacherCourses)

router.get('/courses', viewCourse); // student
router.get('/courses/:courseId', viewCourseById); // student
// router.get('/courses/:courseId/content', authenticateToken, isEnrolled, viewCourseContent) // student

module.exports = router;