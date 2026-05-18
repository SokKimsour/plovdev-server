const express = require('express');
const router = express.Router();

const { createProfile, getUserProfile, getUserProfileById, updateUserProfile } = require("../controller/UserProfile.controller");
const { authenticateToken } = require('../middlewares/authMiddleWare');

const {uploadToProfile} = require("../utils/multer");

router.post('/user/profile', /* #swagger.tags = ['User profile'] */  authenticateToken, uploadToProfile.single('file'), createProfile);
router.put('/user/me/profile', /* #swagger.tags = ['User profile'] */  authenticateToken, uploadToProfile.single('file'), updateUserProfile);
router.get('/user/me/profile', /* #swagger.tags = ['User profile'] */  authenticateToken, getUserProfile);
router.get('/user/profile/:userId', /* #swagger.tags = ['User profile'] */  getUserProfileById); // for everyone can access teacher profile

module.exports = router;