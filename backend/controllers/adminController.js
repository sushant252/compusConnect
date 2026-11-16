const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Convert advertised salary into numeric LPA value
const getSalaryValue = (salary) => {
    if (!salary || !String(salary).toUpperCase().includes("LPA")) {
        return null;
    }

    const numbers = String(salary).match(/\d+(?:\.\d+)?/g);

    if (!numbers || numbers.length === 0) {
        return null;
    }

    const values = numbers.map(Number);

    return (
        values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getDashboardData = async (req, res) => {
    try {
        const [
            totalStudents,
            totalCompanies,
            activeJobs,
            totalApplications,
            recentApplications
        ] = await Promise.all([
            User.countDocuments({ role: "student" }),

            Company.countDocuments(),

            Job.countDocuments({
                status: "Open",
                applicationDeadline: { $gte: new Date() }
            }),

            Application.countDocuments(),

            Application.find()
                .populate("student", "name email")
                .populate({
                    path: "job",
                    select: "title company",
                    populate: {
                        path: "company",
                        select: "name"
                    }
                })
                .sort({ appliedAt: -1 })
                .limit(5)
        ]);

        const recentActivities = recentApplications.map((application) => {
            let action = "applied for";

            if (application.status === "Shortlisted") {
                action = "was shortlisted for";
            } else if (application.status === "Rejected") {
                action = "was rejected for";
            } else if (application.status === "Selected") {
                action = "was selected for";
            }

            return {
                id: application._id,
                studentName: application.student?.name || "Unknown Student",
                action,
                jobTitle: application.job?.title || "Unknown Job",
                companyName:
                    application.job?.company?.name || "Unknown Company",
                status: application.status,
                date: application.appliedAt || application.createdAt
            };
        });

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalCompanies,
                activeJobs,
                totalApplications
            },
            recentActivities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

// ==========================================
// ADMIN REPORTS
// ==========================================

const getReportsData = async (req, res) => {
    try {
        const [
            students,
            companies,
            jobs,
            allApplications,
            selectedApplications
        ] = await Promise.all([
            User.find({ role: "student" }).select("name branch"),

            Company.find().select("name"),

            Job.find().select("title company salary vacancies"),

            Application.find().sort({ appliedAt: 1 }),

            Application.find({ status: "Selected" })
                .populate("student", "name branch")
                .populate({
                    path: "job",
                    select: "salary company",
                    populate: {
                        path: "company",
                        select: "name"
                    }
                })
        ]);

        // ----------------------------------
        // OVERVIEW REPORT
        // ----------------------------------

        const placedStudentIds = new Set(
            selectedApplications
                .filter((app) => app.student)
                .map((app) => String(app.student._id))
        );

        const totalStudents = students.length;
        const placedStudents = placedStudentIds.size;

        const placementPercentage =
            totalStudents > 0
                ? Number(
                    ((placedStudents / totalStudents) * 100).toFixed(2)
                )
                : 0;

        // ----------------------------------
        // BRANCH-WISE REPORT
        // ----------------------------------

        const branchMap = {};

        students.forEach((student) => {
            const branch = student.branch || "Not Specified";

            if (!branchMap[branch]) {
                branchMap[branch] = {
                    branch,
                    total: 0,
                    placedIds: new Set()
                };
            }

            branchMap[branch].total += 1;
        });

        selectedApplications.forEach((app) => {
            if (!app.student) return;

            const branch = app.student.branch || "Not Specified";

            if (!branchMap[branch]) {
                branchMap[branch] = {
                    branch,
                    total: 0,
                    placedIds: new Set()
                };
            }

            branchMap[branch].placedIds.add(
                String(app.student._id)
            );
        });

        const branchData = Object.values(branchMap).map((branch) => ({
            branch: branch.branch,
            total: branch.total,
            placed: branch.placedIds.size,
            notPlaced: Math.max(
                0,
                branch.total - branch.placedIds.size
            )
        }));

        // ----------------------------------
        // COMPANY-WISE REPORT
        // ----------------------------------

        const companyMap = {};

        selectedApplications.forEach((app) => {
            const companyName =
                app.job?.company?.name || "Unknown Company";

            if (!companyMap[companyName]) {
                companyMap[companyName] = {
                    name: companyName,
                    studentIds: new Set(),
                    packages: new Set()
                };
            }

            // Count each selected student only once per company
            if (app.student) {
                companyMap[companyName].studentIds.add(
                    String(app.student._id)
                );
            }

            // Store advertised salary/package
            if (app.job?.salary) {
                companyMap[companyName].packages.add(
                    app.job.salary
                );
            }
        });

        const companyData = Object.values(companyMap)
            .map((company) => ({
                name: company.name,
                students: company.studentIds.size,
                package:
                    company.packages.size > 0
                        ? Array.from(company.packages).join(", ")
                        : "Not disclosed"
            }))
            .sort((a, b) => b.students - a.students);

        // ----------------------------------
        // PACKAGE REPORT
        // ----------------------------------

        const salaryValues = selectedApplications
            .map((app) => getSalaryValue(app.job?.salary))
            .filter((salary) => salary !== null);

        const averagePackage =
            salaryValues.length > 0
                ? Number(
                    (
                        salaryValues.reduce(
                            (sum, salary) => sum + salary,
                            0
                        ) / salaryValues.length
                    ).toFixed(2)
                )
                : 0;

        const highestPackage =
            salaryValues.length > 0
                ? Math.max(...salaryValues)
                : 0;

        // ----------------------------------
        // MONTHLY APPLICATION REPORT
        // ----------------------------------

        const monthlyData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();

            date.setDate(1);
            date.setMonth(date.getMonth() - i);

            const month = date.toLocaleString("en-US", {
                month: "short"
            });

            const year = date.getFullYear();

            const applicationCount = allApplications.filter((app) => {
                const appliedDate = new Date(
                    app.appliedAt || app.createdAt
                );

                return (
                    appliedDate.getMonth() === date.getMonth() &&
                    appliedDate.getFullYear() === year
                );
            }).length;

            monthlyData.push({
                month,
                applications: applicationCount
            });
        }

        // ----------------------------------
        // JOB OPPORTUNITIES
        // ----------------------------------

        const totalJobOpportunities = jobs.reduce(
            (total, job) => total + (Number(job.vacancies) || 0),
            0
        );

        // ----------------------------------
        // FINAL REPORT RESPONSE
        // ----------------------------------

        res.status(200).json({
            success: true,

            overview: {
                totalStudents,
                placedStudents,
                placementPercentage,
                averagePackage,
                highestPackage,
                totalCompanies: companies.length,
                totalJobs: jobs.length,
                totalJobOpportunities
            },

            branchData,
            monthlyData,
            companyData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reports data",
            error: error.message
        });
    }
};

// ==========================================
// GET ALL STUDENTS
// ==========================================

const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" })
            .select(
                "name email enrollmentNumber branch cgpa graduationYear phone resume"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const mongoose = require("mongoose");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await User.findOne({
            _id: id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete student",
            error: error.message
        });
    }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getDashboardData,
    getReportsData,
    getAllStudents,
    deleteStudent
};