const express = require('express');
const router = express.Router();

const { createLesson, updateLesson , deleteLesson , getLessons , getLessonById} = require('../controller/Lesson.controller');
const { authenticateToken , isAdmin} = require('../middlewares/authMiddleWare');
const {uploadToVideo} = require("../utils/multer");

// public
router.get('/section/:sectionId/lesson' , /* #swagger.tags = ['Lesson'] */  getLessons)
router.get('/section/:sectionId/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, getLessonById)

// teacher and admin
router.post('/section/:sectionId/lesson',  /* #swagger.tags = ['Lesson'] */  authenticateToken, uploadToVideo.single('video'), createLesson)
router.put('/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, uploadToVideo.single('video'), updateLesson)
router.delete('/lesson/:lessonId',  /* #swagger.tags = ['Lesson'] */  authenticateToken, deleteLesson)

module.exports = router;