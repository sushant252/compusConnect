
const Job = require("../models/Job");

// @desc    Add a new job
// @route   POST /api/jobs
// @access  Admin
const addJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            jobType,
            salary,
            eligibility,
            requiredSkills,
            applicationDeadline,
            vacancies
        } = req.body;

        if (!title || !company || !description || !location || !applicationDeadline) {
            return res.status(400).json({
                message: "Please provide all required job details."
            });
        }

        const job = await Job.create({
            title,
            company,
            description,
            location,
            jobType,
            salary,
            eligibility,
            requiredSkills,
            applicationDeadline,
            vacancies
        });

        const populatedJob = await Job.findById(job._id).populate(
            "company",
            "name logo location"
        );

        res.status(201).json({
            message: "Job added successfully!",
            job: populatedJob
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Admin
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("company", "name logo location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Admin
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "name logo location");

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        res.status(200).json({ job });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Admin
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("company", "name logo location");

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        res.status(200).json({
            message: "Job updated successfully!",
            job
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Admin
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        res.status(200).json({
            message: "Job deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};
