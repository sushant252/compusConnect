
const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc Apply for a job
// @route POST /api/applications
// @access Student
const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter, resume } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.status !== "Open") {
            return res.status(400).json({
                message: "This job is closed"
            });
        }

        if (new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }

        const existingApplication = await Application.findOne({
            student: req.user._id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        const application = await Application.create({
            student: req.user._id,
            job: jobId,
            coverLetter,
            resume
        });

        const populatedApplication = await Application.findById(
            application._id
        )
            .populate("student", "name email enrollmentNumber")
            .populate({
                path: "job",
                select: "title company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            });

        res.status(201).json({
            message: "Application submitted successfully!",
            application: populatedApplication
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Get logged-in student's applications
// @route GET /api/applications/my
// @access Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user._id
        })
            .populate("student", "name email enrollmentNumber")
            .populate({
                path: "job",
                select: "title company location salary status applicationDeadline",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Get all applications
// @route GET /api/applications
// @access Admin
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate(
                "student",
                "name email enrollmentNumber branch cgpa phone resume"
            )
            .populate({
                path: "job",
                select: "title company location salary",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Update application status
// @route PUT /api/applications/:id/status
// @access Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate(
                "student",
                "name email enrollmentNumber branch cgpa phone resume"
            )
            .populate({
                path: "job",
                select: "title company location salary",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application status updated successfully!",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    applyForJob,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
};
