const express = require('express');
const router = express.Router();

const { createLesson, updateLesson , deleteLesson , getLessons , getLessonById} = require('../controller/Section.controller');
const { authenticateToken, isTeacher , isAdmin} = require('../middlewares/authMiddleWare');

router.post('/course/:courseId/lesson',  authenticateToken , createLesson); // teacher
router.put('/course/:courseId/lesson/:lessonId',  authenticateToken , updateLesson); // teacher
router.delete('/course/:courseId/lesson/:lessonId',  authenticateToken , deleteLesson); // teacher
router.get('/course/:courseId/lessons',  authenticateToken , getLessons); // teacher
router.get('/course/:courseId/lesson/:lessonId',  authenticateToken , getLessonById); // teacher

module.exports = router;