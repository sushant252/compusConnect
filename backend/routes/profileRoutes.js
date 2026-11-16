
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { getMyProfile, updateMyProfile} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const {uploadResume, downloadResume} = require("../controllers/resumeController");
// Only students can access their own profile
router.use(protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can access this profile"
        });
    }
    next();
});

// Get logged-in student's profile
router.get("/me", getMyProfile);

// Update logged-in student's profile
router.put("/me", updateMyProfile);
// Upload or replace student resume
router.post("/resume", upload.single("resume"), uploadResume);
// Download logged-in student's resume
router.get("/resume/download", downloadResume);
module.exports = router;
