const express = require("express");
const router = express.Router();

const {
    scheduleInterview,
    getAllInterviews,
    getMyInterviews,
    updateInterviewStatus
} = require("../controllers/interviewController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student: View own interviews
router.get("/my", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can view their interviews"
        });
    }
    next();
}, getMyInterviews);

// Admin: Schedule an interview
router.post("/", protect, adminOnly, scheduleInterview);

// Admin: View all interviews
router.get("/", protect, adminOnly, getAllInterviews);

// Admin: Update interview status
router.put("/:id/status", protect, adminOnly, updateInterviewStatus);

module.exports = router;