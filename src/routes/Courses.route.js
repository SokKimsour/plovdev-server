const express = require('express');
const router = express.Router();

const {createCourse ,  updateCourse , deleteCourse, publishCourse, viewCourse , viewCourseById , getTeacherCourses, viewCourseContent}   = require("../controller/Course.controller");
const { authenticateToken, isTeacher , isAdmin, isEnrolled, isTeacherOrAdmin, isEnrolledOrTeacher} = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer")   

// PUBLIC
router.get('/courses', viewCourse)
router.get('/course/me', authenticateToken, isTeacherOrAdmin, getTeacherCourses) // must be before /:courseId
router.get('/course/:courseId', viewCourseById)

// STUDENT
router.get('/courses/:courseId/content', authenticateToken, isEnrolledOrTeacher, viewCourseContent)

// TEACHER OR ADMIN
router.post('/course', authenticateToken, isTeacherOrAdmin, upload.single('thumbnail'), createCourse)
router.put('/course/:courseId', authenticateToken, isTeacherOrAdmin, upload.single('thumbnail'), updateCourse)
router.delete('/course/:courseId', authenticateToken, isTeacherOrAdmin, deleteCourse)
router.post('/course/:courseId/publish', authenticateToken, isTeacherOrAdmin, publishCourse)

module.exports = router;