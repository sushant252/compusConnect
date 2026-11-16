const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true
        },
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
        interviewDate: {
            type: Date,
            required: true
        },
        interviewTime: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            enum: ["Online", "Offline"],
            default: "Online"
        },
        meetingLink: {
            type: String,
            default: ""
        },
        venue: {
            type: String,
            default: ""
        },
        round: {
            type: String,
            default: "Technical Round"
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        },
        instructions: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);