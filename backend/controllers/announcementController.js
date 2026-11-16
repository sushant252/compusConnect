
const Announcement = require("../models/Announcement");

// Create announcement - Admin
const createAnnouncement = async (req, res) => {
    try {
        const {
            title,
            message,
            category,
            priority,
            isActive,
            expiryDate
        } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                message: "Title and message are required"
            });
        }

        const announcement = await Announcement.create({
            title,
            message,
            category,
            priority,
            isActive: isActive !== undefined ? isActive : true,
            expiryDate: expiryDate || null,
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Announcement created successfully!",
            announcement
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create announcement",
            error: error.message
        });
    }
};

// Get announcements
// Admin gets all; students get active and non-expired
const getAnnouncements = async (req, res) => {
    try {
        let query = {};

        if (req.user.role !== "admin") {
            query = {
                isActive: true,
                $or: [
                    { expiryDate: null },
                    { expiryDate: { $gt: new Date() } }
                ]
            };
        }

        const announcements = await Announcement.find(query)
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: announcements.length,
            announcements
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch announcements",
            error: error.message
        });
    }
};

// Update announcement - Admin
const updateAnnouncement = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "message",
            "category",
            "priority",
            "isActive",
            "expiryDate"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        res.status(200).json({
            message: "Announcement updated successfully!",
            announcement
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update announcement",
            error: error.message
        });
    }
};

// Delete announcement - Admin
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(
            req.params.id
        );

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        res.status(200).json({
            message: "Announcement deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete announcement",
            error: error.message
        });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};
