const express = require('express');
const router = express.Router();

const { createSection, updateSection , deleteSection , getSections } = require('../controller/Section.controller');
const { authenticateToken, isTeacher , isAdmin, isTeacherOrAdmin} = require('../middlewares/authMiddleWare');

router.post('/course/:courseId/section',  authenticateToken ,isTeacherOrAdmin,createSection); // teacher
router.put('/course/:courseId/section/:sectionId',  authenticateToken , isTeacherOrAdmin, updateSection); // teacher
router.delete('/course/:courseId/section/:sectionId',  authenticateToken ,isTeacherOrAdmin , deleteSection); // teacher

// public
router.get('/course/:courseId/sections',  authenticateToken , getSections); 

module.exports = router;