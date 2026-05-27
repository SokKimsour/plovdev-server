const { admin_notifications, Users, courses } = require("../models");
const AppError = require("../utils/appError");

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {
    const notifications = await admin_notifications.findAll({
        include: [
            {
                model: Users,
                as: "user",
                attributes: { exclude: ["password"] }
            },
            {
                model: courses,
                as: "course",
                attributes: ["id", "title_en", "price"]
            }
        ],
        order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
        status: "success",
        message: "Notifications fetched successfully",
        data: notifications
    });
};

// MARK SINGLE NOTIFICATION AS READ
const markAsRead = async (req, res) => {
    const { notificationId } = req.params;

    const notification = await admin_notifications.findByPk(notificationId);

    if (!notification) {
        throw new AppError("Notification not found", 404);
    }

    await notification.update({ is_read: true });

    const updatedNotification = await admin_notifications.findOne({
        where: { id: notification.id },
        include: [
            {
                model: Users,
                as: "user",
                attributes: { exclude: ["password"] }
            },
            {
                model: courses,
                as: "course",
                attributes: ["id", "title_en", "price"]
            }
        ]
    });

    res.status(200).json({
        status: "success",
        message: "Notification marked as read",
        data: updatedNotification
    });
};

// MARK ALL NOTIFICATIONS AS READ
const markAllAsRead = async (req, res) => {
    await admin_notifications.update(
        { is_read: true },
        { where: { is_read: false } }
    );

    res.status(200).json({
        status: "success",
        message: "All notifications marked as read",
        data: null
    });
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
