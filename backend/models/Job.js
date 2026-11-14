
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        jobType: {
            type: String,
            enum: ["Full Time", "Internship", "Part Time"],
            default: "Full Time"
        },
        salary: {
            type: String,
            default: "Not disclosed"
        },
        eligibility: {
            minCGPA: {
                type: Number,
                default: 0,
                min: 0,
                max: 10
            },
            branches: [{
                type: String
            }],
            graduationYears: [{
                type: Number
            }]
        },
        requiredSkills: [{
            type: String
        }],
        applicationDeadline: {
            type: Date,
            required: true
        },
        vacancies: {
            type: Number,
            default: 1,
            min: 1
        },
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
