const express = require('express');
const router = express.Router();

const { createProfile, getUserProfile, getUserProfileById, updateUserProfile } = require("../controller/UserProfile.controller");
const { authenticateToken, isTeacher } = require('../middlewares/authMiddleWare');

const upload = require("../utils/multer");

router.post('/user/profile', authenticateToken, upload.single('file'), createProfile);
router.put('/user/me/profile', authenticateToken, upload.single('file'), updateUserProfile);
router.get('/user/me/profile', authenticateToken, getUserProfile);
router.get('/user/profile/:userId', getUserProfileById); // for everyone can access teacher profile


module.exports = router;