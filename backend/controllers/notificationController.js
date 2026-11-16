
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Send notification to one student or all students
// @route   POST /api/notifications
// @access  Admin
const createNotification = async (req, res) => {
    try {
        const { recipientId, title, message, type } = req.body;

        if (!recipientId || !title || !message) {
            return res.status(400).json({
                message: "Recipient, title and message are required"
            });
        }

        let recipients = [];

        if (recipientId === "all") {
            recipients = await User.find({ role: "student" }).select("_id");
        } else {
            const student = await User.findOne({
                _id: recipientId,
                role: "student"
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            recipients = [student];
        }

        if (recipients.length === 0) {
            return res.status(404).json({
                message: "No students found"
            });
        }

        const notifications = await Notification.insertMany(
            recipients.map((student) => ({
                recipient: student._id,
                title,
                message,
                type,
                createdBy: req.user._id
            }))
        );

        res.status(201).json({
            message: "Notification sent successfully!",
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to send notification",
            error: error.message
        });
    }
};

// @desc    Get logged-in student's notifications
// @route   GET /api/notifications/my
// @access  Student
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id
        })
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: notifications.length,
            unreadCount: notifications.filter(
                (notification) => !notification.isRead
            ).length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Student
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipient: req.user._id
            },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read!",
            notification
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead
};
