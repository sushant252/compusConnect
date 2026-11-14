
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        phone: {
            type: String
        },

        enrollmentNumber: {
            type: String,
            unique: true,
            sparse: true
        },

        branch: {
            type: String
        },

        cgpa: {
            type: Number,
            min: 0,
            max: 10
        },

        graduationYear: {
            type: Number
        },

        skills: [{
            type: String
        }],

        resume: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
