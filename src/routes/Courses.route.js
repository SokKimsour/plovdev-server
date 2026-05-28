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

const { authenticateToken, isAdmin, isEnrolled } = require('../middlewares/authMiddleware');
const { uploadToThumbnail } = require("../utils/multer");

// PUBLIC
router.get('/courses', /* #swagger.tags = ['Course'] */  viewCourse)
router.get('/courses/me',  /* #swagger.tags = ['Course'] */  authenticateToken, getTeacherCourses)  
router.get('/courses/me/:courseId',  /* #swagger.tags = ['Course'] */  authenticateToken, getTeacherCoursesById)  
router.get('/courses/:courseId',  /* #swagger.tags = ['Course'] */  viewCourseById)

// STUDENT
router.get('/courses/:courseId/content',  /* #swagger.tags = ['Course'] */  authenticateToken, isEnrolled, viewCourseContent)  

// TEACHER
router.post('/courses', /* #swagger.tags = ['Course'] */  authenticateToken, uploadToThumbnail.single('thumbnail'), createCourse)
router.put('/courses/:courseId',  /* #swagger.tags = ['Course'] */  authenticateToken, uploadToThumbnail.single('thumbnail'), updateCourse)
router.delete('/courses/:courseId',  /* #swagger.tags = ['Course'] */  authenticateToken, deleteCourse)
router.post('/courses/:courseId/submit',  /* #swagger.tags = ['Course'] */  authenticateToken, submitCourse)  
router.post('/courses/:courseId/archive',  /* #swagger.tags = ['Course'] */  authenticateToken, archiveCourse)  

module.exports = router;