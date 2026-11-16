
const User = require("../models/User");

// @desc    Get logged-in student's profile
// @route   GET /api/profile/me
// @access  Student
const getMyProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user._id)
            .select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully!",
            student
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

// @desc    Update logged-in student's profile
// @route   PUT /api/profile/me
// @access  Student
const updateMyProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            branch,
            cgpa,
            graduationYear,
            skills
        } = req.body;

        const student = await User.findById(req.user._id);

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        if (name !== undefined) student.name = name;
        if (phone !== undefined) student.phone = phone;
        if (branch !== undefined) student.branch = branch;
        if (cgpa !== undefined) student.cgpa = cgpa;
        if (graduationYear !== undefined) {
            student.graduationYear = graduationYear;
        }
        if (skills !== undefined) student.skills = skills;

        const updatedStudent = await student.save();

        res.status(200).json({
            message: "Profile updated successfully!",
            student: updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile
};
