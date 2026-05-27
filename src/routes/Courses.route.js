const express = require('express');
const router = express.Router();

const {
  createCourse,
  updateCourse,
  deleteCourse,
  submitCourse,     
  archiveCourse,    
  viewCourse,
  viewCourseById,
  getTeacherCourses,
  getTeacherCoursesById,
  viewCourseContent
} = require("../controller/Course.controller");

const { authenticateToken, isAdmin, isEnrolled } = require('../middlewares/authMiddleWare');
const { uploadToThumbnail } = require("../utils/multer");

// PUBLIC
router.get('/courses', viewCourse)
router.get('/courses/me', authenticateToken, getTeacherCourses)  
router.get('/courses/me/:courseId', authenticateToken, getTeacherCoursesById)  
router.get('/courses/:courseId', viewCourseById)

// STUDENT
router.get('/courses/:courseId/content', authenticateToken, isEnrolled, viewCourseContent)  

// TEACHER
router.post('/courses', authenticateToken, uploadToThumbnail.single('thumbnail'), createCourse)
router.put('/courses/:courseId', authenticateToken, uploadToThumbnail.single('thumbnail'), updateCourse)
router.delete('/courses/:courseId', authenticateToken, deleteCourse)
router.post('/courses/:courseId/submit', authenticateToken, submitCourse)  
router.post('/courses/:courseId/archive', authenticateToken, archiveCourse)  

module.exports = router;