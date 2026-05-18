const express = require('express');
const router = express.Router();

const {createCourse ,  updateCourse , deleteCourse, publishCourse, viewCourse , viewCourseById , getTeacherCourses, viewCourseContent}   = require("../controller/Course.controller");
const { authenticateToken , isAdmin, isEnrolled} = require('../middlewares/authMiddleWare');

const {uploadToThumnail} = require("../utils/multer")   

// PUBLIC
router.get('/courses', /* #swagger.tags = ['Course'] */  viewCourse)
router.get('/course/me',  /* #swagger.tags = ['Course'] */  authenticateToken, getTeacherCourses) // must be before /:courseId
router.get('/course/:courseId',  /* #swagger.tags = ['Course'] */  viewCourseById)

// STUDENT
router.get('/courses/:courseId/content',  /* #swagger.tags = ['Course'] */  authenticateToken, viewCourseContent)

// TEACHER OR ADMIN
router.post('/course',  /* #swagger.tags = ['Course'] */  authenticateToken, uploadToThumnail.single('thumbnail'), createCourse)
router.put('/course/:courseId',  /* #swagger.tags = ['Course'] */  authenticateToken, uploadToThumnail.single('thumbnail'), updateCourse)
router.delete('/course/:courseId',  /* #swagger.tags = ['Course'] */  authenticateToken, deleteCourse)
router.post('/course/:courseId/publish',  /* #swagger.tags = ['Course'] */  authenticateToken, publishCourse)

module.exports = router;