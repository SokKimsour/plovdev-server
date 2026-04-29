const express = require('express');
const router = express.Router();

const {createProfile , getTeacherProfile , getTeacherProfileById , updateTeacherProfile} = require("../controller/TeacherProfile.controller");
const { authenticateToken, isTeacher } = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer")

router.post('/teacher/profile',  authenticateToken,  upload.single('file'),  createProfile);
router.put('/teacher/profile', authenticateToken, upload.single('file'), updateTeacherProfile);
router.get('/teacher/profile',  authenticateToken,  getTeacherProfile);
router.get('/teacher/profile/:userId',  getTeacherProfileById); // for everyone can access teacher profile


module.exports = router;