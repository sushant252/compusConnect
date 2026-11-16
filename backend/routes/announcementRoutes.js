
const express = require("express");
const router = express.Router();

const {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student and Admin: View active announcements
router.get("/", protect, getAnnouncements);

// Admin: Create announcement
router.post("/", protect, adminOnly, createAnnouncement);

// Admin: Update announcement
router.put("/:id", protect, adminOnly, updateAnnouncement);

// Admin: Delete announcement
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;
