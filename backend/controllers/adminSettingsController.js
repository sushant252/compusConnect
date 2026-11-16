
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ==========================================
// GET ADMIN PROFILE
// ==========================================

const getAdminProfile = async (req, res) => {
    try {
        const admin = await User.findOne({
            _id: req.user._id,
            role: "admin"
        }).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================

const updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingAdmin = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user._id }
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered"
            });
        }

        const admin = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                role: "admin"
            },
            {
                name: name.trim(),
                email: normalizedEmail
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully",
            admin
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update admin profile",
            error: error.message
        });
    }
};

// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================

const changeAdminPassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        const admin = await User.findOne({
            _id: req.user._id,
            role: "admin"
        }).select("+password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        admin.password = await bcrypt.hash(newPassword, 12);
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully. Please login again."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
};

module.exports = {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
};
