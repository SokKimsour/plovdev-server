const express = require('express');
const router = express.Router();

const { createLesson, updateLesson , deleteLesson , getLessons , getLessonById} = require('../controller/Lesson.controller');
const { authenticateToken, isTeacher , isAdmin, isTeacherOrAdmin, isEnrolledOrTeacher} = require('../middlewares/authMiddleWare');
const upload = require("../utils/multer");

// public
router.get('/section/:sectionId/lesson' , /* #swagger.tags = ['Lesson'] */  getLessons)
router.get('/section/:sectionId/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, isEnrolledOrTeacher, getLessonById)

// teacher and admin
router.post('/section/:sectionId/lesson',  /* #swagger.tags = ['Lesson'] */  authenticateToken, isTeacherOrAdmin, upload.single('video'), createLesson)
router.put('/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, isTeacherOrAdmin, upload.single('video'), updateLesson)
router.delete('/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, isTeacherOrAdmin, deleteLesson)



module.exports = router;