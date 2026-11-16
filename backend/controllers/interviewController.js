
const Interview = require("../models/Interview");
const Application = require("../models/Application");

// @desc Schedule an interview
// @route POST /api/interviews
// @access Admin
const scheduleInterview = async (req, res) => {
    try {
        const {
            applicationId,
            interviewDate,
            interviewTime,
            mode,
            meetingLink,
            venue,
            round,
            instructions
        } = req.body;

        if (!applicationId || !interviewDate || !interviewTime) {
            return res.status(400).json({
                message: "Application ID, interview date and time are required"
            });
        }

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (application.status !== "Shortlisted") {
            return res.status(400).json({
                message: "Only shortlisted students can be scheduled for interviews"
            });
        }

        // Prevent duplicate interview for the same application
        const existingInterview = await Interview.findOne({
            application: application._id
        });

        if (existingInterview) {
            return res.status(400).json({
                message: "An interview is already scheduled for this application"
            });
        }

        const interview = await Interview.create({
            application: application._id,
            student: application.student,
            job: application.job,
            interviewDate,
            interviewTime,
            mode,
            meetingLink,
            venue,
            round,
            instructions
        });

        const populatedInterview = await Interview.findById(interview._id)
            .populate("student", "name email enrollmentNumber")
            .populate({
                path: "job",
                select: "title location company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .populate("application", "status");

        res.status(201).json({
            message: "Interview scheduled successfully!",
            interview: populatedInterview
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Get all interviews (Admin)
// @route GET /api/interviews
// @access Admin
const getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate("student", "name email enrollmentNumber")
            .populate({
                path: "job",
                select: "title location company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .populate("application", "status")
            .sort({ interviewDate: 1 });

        res.status(200).json({
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Get logged-in student's interviews
// @route GET /api/interviews/my
// @access Student
const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            student: req.user._id
        })
            .populate({
                path: "job",
                select: "title location company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .populate("application", "status")
            .sort({ interviewDate: 1 });

        res.status(200).json({
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc Update interview status
// @route PUT /api/interviews/:id/status
// @access Admin
const updateInterviewStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Scheduled",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid interview status"
            });
        }

        const interview = await Interview.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate("student", "name email enrollmentNumber")
            .populate({
                path: "job",
                select: "title location company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .populate("application", "status");

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            message: "Interview status updated successfully!",
            interview
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    scheduleInterview,
    getAllInterviews,
    getMyInterviews,
    updateInterviewStatus
};
