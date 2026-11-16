
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Upload or replace student resume
// @route   POST /api/profile/resume
// @access  Student
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a PDF resume to upload"
            });
        }

        const student = await User.findById(req.user._id);

        if (!student) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Delete previous resume if it exists
        if (student.resume) {
            const oldResumePath = path.join(
                __dirname,
                "..",
                student.resume
            );

            if (fs.existsSync(oldResumePath)) {
                fs.unlinkSync(oldResumePath);
            }
        }

        // Save new resume path in MongoDB
        student.resume = `uploads/${req.file.filename}`;

        await student.save();

        res.status(200).json({
            message: "Resume uploaded successfully!",
            resume: student.resume
        });

    } catch (error) {
        // Remove newly uploaded file if saving fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            message: "Failed to upload resume",
            error: error.message
        });
    }
};


const downloadResume = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);

        if (!student || !student.resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        const resumePath = path.resolve(
            __dirname,
            "..",
            student.resume
        );

        if (!resumePath.startsWith(
            path.resolve(__dirname, "../uploads") + path.sep
        )) {
            return res.status(400).json({
                message: "Invalid resume path"
            });
        }

        if (!fs.existsSync(resumePath)) {
            return res.status(404).json({
                message: "Resume file not found"
            });
        }

        res.download(resumePath);

    } catch (error) {
        res.status(500).json({
            message: "Failed to download resume",
            error: error.message
        });
    }
};

// @desc    View or download a student's resume (Admin)
// @route   GET /api/admin/students/:id/resume
// @access  Admin
const getStudentResume = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        });

        if (!student || !student.resume) {
            return res.status(404).json({
                message: "Student resume not found"
            });
        }

        const uploadsDirectory = path.resolve(__dirname, "../uploads");
        const resumePath = path.resolve(__dirname, "..", student.resume);

        // Security check: allow files only from the uploads directory
        if (!resumePath.startsWith(uploadsDirectory + path.sep)) {
            return res.status(400).json({
                message: "Invalid resume path"
            });
        }

        if (!fs.existsSync(resumePath)) {
            return res.status(404).json({
                message: "Resume file not found"
            });
        }

        if (req.query.download === "true") {
            return res.download(resumePath);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        return res.sendFile(resumePath);

    } catch (error) {
        res.status(500).json({
            message: "Failed to access student resume",
            error: error.message
        });
    }
};
module.exports = {
    uploadResume,
    downloadResume,
    getStudentResume
};
