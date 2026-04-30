const express = require('express');
const router = express.Router();

const { createSection, updateSection , deleteSection , getSections } = require('../controller/Section.controller');
const { authenticateToken, isTeacher , isAdmin} = require('../middlewares/authMiddleWare');

router.post('/course/:courseId/section',  authenticateToken , createSection); // teacher
router.put('/course/:courseId/section/:sectionId',  authenticateToken , updateSection); // teacher
router.delete('/course/:courseId/section/:sectionId',  authenticateToken , deleteSection); // teacher
router.get('/course/:courseId/sections',  authenticateToken , getSections); // teacher

module.exports = router;