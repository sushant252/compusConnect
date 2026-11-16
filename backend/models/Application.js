const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        resume: {
            type: String,
            default: ""
        },
        coverLetter: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["Pending", "Shortlisted", "Rejected", "Selected"],
            default: "Pending"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Prevent a student from applying to the same job twice
applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);