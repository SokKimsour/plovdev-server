const express = require('express');
const router = express.Router();

const {createProfile , getStudentProfile , getStudentProfileById , updateStudentProfile} = require("../controller/StudentProfile.controller");
const { authenticateToken } = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer")

router.post('/student/profile',  authenticateToken,  upload.single('file'),  createProfile);
router.put('/student/profile', authenticateToken, upload.single('file'), updateStudentProfile);
router.get('/student/profile',  authenticateToken,  getStudentProfile);
router.get('/student/profile/:userId',  getStudentProfileById); // for everyone can access student profile


module.exports = router;