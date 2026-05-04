const express = require('express');
const router = express.Router();

const { createLesson, updateLesson , deleteLesson , getLessons , getLessonById} = require('../controller/Lesson.controller');
const { authenticateToken, isTeacher , isAdmin, isTeacherOrAdmin, isEnrolledOrTeacher} = require('../middlewares/authMiddleWare');
const upload = require("../utils/multer");

// public
router.get('/section/:sectionId/lesson', getLessons)
router.get('/section/:sectionId/lesson/:lessonId', authenticateToken, isEnrolledOrTeacher, getLessonById)

// teacher and admin
router.post('/section/:sectionId/lesson', authenticateToken, isTeacherOrAdmin, upload.single('video'), createLesson)
router.put('/lesson/:lessonId', authenticateToken, isTeacherOrAdmin, upload.single('video'), updateLesson)
router.delete('/lesson/:lessonId', authenticateToken, isTeacherOrAdmin, deleteLesson)



module.exports = router;