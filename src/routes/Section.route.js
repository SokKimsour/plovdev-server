const express = require('express');
const router = express.Router();

const { createSection, updateSection , deleteSection , getSections } = require('../controller/Section.controller');
const { authenticateToken , isAdmin} = require('../middlewares/authMiddleWare');

router.post('/course/:courseId/section',  /* #swagger.tags = ['Section'] */   authenticateToken ,createSection); // teacher
router.put('/course/:courseId/section/:sectionId',  /* #swagger.tags = ['Section'] */  authenticateToken , updateSection); // teacher
router.delete('/course/:courseId/section/:sectionId', /* #swagger.tags = ['Section'] */   authenticateToken  , deleteSection); // teacher

// public
router.get('/course/:courseId/sections',  /* #swagger.tags = ['Section'] */  authenticateToken , getSections); 

module.exports = router;