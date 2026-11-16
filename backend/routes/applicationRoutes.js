const express = require("express");
const router = express.Router();

const {
    applyForJob,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student routes
router.post("/", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can apply for jobs"
        });
    }
    next();
}, applyForJob);

router.get("/my", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can view their applications"
        });
    }
    next();
}, getMyApplications);

// Admin routes
router.get("/", protect, adminOnly, getAllApplications);

router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;