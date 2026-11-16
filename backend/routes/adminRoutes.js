
const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getStudentResume } = require("../controllers/resumeController");
const {
    getDashboardData,
    getReportsData,
    getAllStudents,
    deleteStudent
} = require("../controllers/adminController");

const {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
} = require("../controllers/adminSettingsController");
router.get("/dashboard", protect, adminOnly, getDashboardData);
router.get("/reports", protect, adminOnly, getReportsData);

// Student Management
router.get("/students", protect, adminOnly, getAllStudents);
router.delete("/students/:id", protect, adminOnly, deleteStudent);
// View or download a student's resume
router.get(
    "/students/:id/resume",
    protect,
    adminOnly,
    getStudentResume
);

// Admin Settings Routes
router.get("/settings/profile", protect, adminOnly, getAdminProfile);

router.put("/settings/profile", protect, adminOnly, updateAdminProfile);

router.put("/settings/password", protect, adminOnly, changeAdminPassword);
module.exports = router;
