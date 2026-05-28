const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controller/AdminNotification.controller');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, isAdmin, /* #swagger.tags = ['Admin Notification'] */ getNotifications);
router.patch('/read-all', authenticateToken, isAdmin, /* #swagger.tags = ['Admin Notification'] */ markAllAsRead);
router.patch('/:notificationId/read', authenticateToken, isAdmin, /* #swagger.tags = ['Admin Notification'] */ markAsRead);

module.exports = router;
