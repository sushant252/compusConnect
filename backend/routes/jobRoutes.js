
const express = require("express");
const router = express.Router();

const {
    addJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes require login
router.use(protect);

// Student and Admin can view jobs
router.get("/", getJobs);
router.get("/:id", getJobById);

// Only Admin can manage jobs
router.post("/", adminOnly, addJob);
router.put("/:id", adminOnly, updateJob);
router.delete("/:id", adminOnly, deleteJob);

module.exports = router;
