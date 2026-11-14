
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
        industry: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            default: ""
        },
        contactEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        contactPhone: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Company", companySchema);
