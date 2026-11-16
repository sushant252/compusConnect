const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: [
                "General",
                "Placement",
                "Event",
                "Important"
            ],
            default: "General"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        expiryDate: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "Announcement",
    announcementSchema
);