
import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./BrowseJobs.css";

function BrowseJobs() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("All");
    const [jobType, setJobType] = useState("All");
    const [salary, setSalary] = useState("All");
    const [selectedJob, setSelectedJob] = useState(null);

    const [loading, setLoading] = useState(true);
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch jobs and student's existing applications
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [jobsResult, applicationsResult] =
                    await Promise.allSettled([
                        API.get("/jobs"),
                        API.get("/applications/my")
                    ]);

                if (jobsResult.status === "fulfilled") {
                    setJobs(jobsResult.value.data.jobs || []);
                } else {
                    throw new Error(
                        jobsResult.reason.response?.data?.message ||
                        "Unable to load jobs."
                    );
                }

                if (applicationsResult.status === "fulfilled") {
                    const applications =
                        applicationsResult.value.data.applications || [];

                    setAppliedJobIds(
                        applications
                            .map((application) => application.job?._id)
                            .filter(Boolean)
                    );
                }
            } catch (err) {
                setError(err.message || "Unable to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getCompanyName = (job) => {
        if (typeof job.company === "object") {
            return job.company?.name || "Company";
        }

        return "Company";
    };

    const getJobType = (type) => {
        if (type === "Full Time") return "Full-time";
        return type || "Not specified";
    };

    const getSalaryNumber = (salaryText) => {
        const match = String(salaryText || "").match(/\d+(\.\d+)?/);
        return match ? Number(match[0]) : null;
    };

    // Only open jobs with valid deadlines
    const availableJobs = useMemo(() => {
        return jobs.filter((job) => {
            return (
                job.status === "Open" &&
                job.applicationDeadline &&
                new Date(job.applicationDeadline) >= new Date()
            );
        });
    }, [jobs]);

    // Search and filters
    const filteredJobs = useMemo(() => {
        return availableJobs.filter((job) => {
            const company = getCompanyName(job);
            const role = job.title || "";
            const jobLocation = job.location || "";
            const type = getJobType(job.jobType);
            const salaryNumber = getSalaryNumber(job.salary);

            const searchMatch =
                role.toLowerCase().includes(search.toLowerCase()) ||
                company.toLowerCase().includes(search.toLowerCase());

            const locationMatch =
                location === "All" || jobLocation === location;

            const typeMatch =
                jobType === "All" || type === jobType;

            const salaryMatch =
                salary === "All" ||
                (salaryNumber !== null &&
                    (
                        (salary === "0-5" && salaryNumber <= 5) ||
                        (salary === "5-8" &&
                            salaryNumber > 5 &&
                            salaryNumber <= 8) ||
                        (salary === "8+" && salaryNumber > 8)
                    ));

            return (
                searchMatch &&
                locationMatch &&
                typeMatch &&
                salaryMatch
            );
        });
    }, [availableJobs, search, location, jobType, salary]);

    // Apply for a job
    const handleApply = async (job) => {
        if (appliedJobIds.includes(job._id)) {
            setMessage("You have already applied for this job.");
            return;
        }

        try {
            setApplyingJobId(job._id);
            setError("");
            setMessage("");

            const response = await API.post("/applications", {
                jobId: job._id
            });

            setAppliedJobIds((previous) => [
                ...previous,
                job._id
            ]);

            setMessage(
                response.data.message ||
                "Application submitted successfully!"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit application. Please try again."
            );
        } finally {
            setApplyingJobId(null);
        }
    };

    const resetFilters = () => {
        setSearch("");
        setLocation("All");
        setJobType("All");
        setSalary("All");
    };

    return (
        <StudentLayout
            title="Browse Jobs"
            subtitle="Explore opportunities and find your next role"
            contentClassName="jobs-content"
        >
            <div className="student-layout">
                <main className="student-main">
                    <section className="dashboard-content">

                        {/* Welcome Section */}
                        <div className="jobs-welcome">
                            <div>
                                <span className="welcome-label">
                                    YOUR NEXT OPPORTUNITY
                                </span>
                                <h2>Find a job that fits your future.</h2>
                                <p>
                                    Discover openings from companies hiring
                                    through your campus.
                                </p>
                            </div>

                            <div className="jobs-welcome-icon">💼</div>
                        </div>

                        {/* Success and Error Messages */}
                        {message && (
                            <div className="alert alert-success" role="alert">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Filters */}
                        <div className="jobs-filter-card">
                            <div className="row g-3 align-items-end">

                                <div className="col-lg-4 col-md-6">
                                    <label className="form-label">
                                        Search jobs
                                    </label>
                                    <input
                                        className="form-control"
                                        type="search"
                                        placeholder="Job title or company..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-lg-2 col-md-6">
                                    <label className="form-label">
                                        Location
                                    </label>
                                    <select
                                        className="form-select"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                    >
                                        <option value="All">All locations</option>
                                        <option value="Noida">Noida</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Gurugram">Gurugram</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Delhi">Delhi</option>
                                    </select>
                                </div>

                                <div className="col-lg-2 col-md-6">
                                    <label className="form-label">
                                        Job type
                                    </label>
                                    <select
                                        className="form-select"
                                        value={jobType}
                                        onChange={(e) =>
                                            setJobType(e.target.value)
                                        }
                                    >
                                        <option value="All">All types</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Part Time">Part Time</option>
                                    </select>
                                </div>

                                <div className="col-lg-2 col-md-6">
                                    <label className="form-label">
                                        Salary
                                    </label>
                                    <select
                                        className="form-select"
                                        value={salary}
                                        onChange={(e) =>
                                            setSalary(e.target.value)
                                        }
                                    >
                                        <option value="All">Any salary</option>
                                        <option value="0-5">Up to 5 LPA</option>
                                        <option value="5-8">5–8 LPA</option>
                                        <option value="8+">Above 8 LPA</option>
                                    </select>
                                </div>

                                <div className="col-lg-2 col-md-12">
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={resetFilters}
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Heading */}
                        <div className="jobs-results-heading">
                            <div>
                                <h5>Available Opportunities</h5>
                                <p className="text-muted mb-0">
                                    Showing {filteredJobs.length} of{" "}
                                    {availableJobs.length} jobs
                                </p>
                            </div>

                            <span className="jobs-count">
                                {filteredJobs.length} Jobs Found
                            </span>
                        </div>

                        {/* Jobs List */}
                        {loading ? (
                            <div className="jobs-empty-state">
                                <h5>Loading jobs...</h5>
                                <p>Please wait while we fetch available jobs.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row g-4">
                                    {filteredJobs.map((job) => {
                                        const company = getCompanyName(job);
                                        const alreadyApplied =
                                            appliedJobIds.includes(job._id);

                                        const skills = job.requiredSkills || [];

                                        return (
                                            <div
                                                className="col-xl-6"
                                                key={job._id}
                                            >
                                                <article className="browse-job-card">
                                                    <div className="browse-job-top">
                                                        <div className="company-logo">
                                                            {company.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="flex-grow-1">
                                                            <h6>{job.title}</h6>
                                                            <p>{company}</p>
                                                        </div>

                                                        <span className="job-type-badge">
                                                            {getJobType(job.jobType)}
                                                        </span>
                                                    </div>

                                                    <div className="browse-job-meta">
                                                        <span>
                                                            📍 {job.location}
                                                        </span>
                                                        <span>
                                                            ₹ {job.salary}
                                                        </span>
                                                        <span>
                                                            ⏳ Apply by{" "}
                                                            {formatDate(job.applicationDeadline)}
                                                        </span>
                                                    </div>

                                                    <div className="job-skills">
                                                        {skills.map((skill) => (
                                                            <span key={skill}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="browse-job-actions">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() =>
                                                                setSelectedJob(job)
                                                            }
                                                        >
                                                            View Details
                                                        </button>

                                                        <button
                                                            className="btn btn-primary"
                                                            disabled={
                                                                alreadyApplied ||
                                                                applyingJobId === job._id
                                                            }
                                                            onClick={() =>
                                                                handleApply(job)
                                                            }
                                                        >
                                                            {alreadyApplied
                                                                ? "Applied ✓"
                                                                : applyingJobId === job._id
                                                                    ? "Applying..."
                                                                    : "Apply Now →"}
                                                        </button>
                                                    </div>
                                                </article>
                                            </div>
                                        );
                                    })}
                                </div>

                                {filteredJobs.length === 0 && (
                                    <div className="jobs-empty-state">
                                        <div>🔎</div>
                                        <h5>No jobs found</h5>
                                        <p>
                                            Try changing your search or filters.
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={resetFilters}
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <footer className="dashboard-footer">
                            © 2026 CampusConnect. All rights reserved.
                        </footer>
                    </section>
                </main>

                {/* Job Details Modal */}
                {selectedJob && (
                    <div
                        className="job-modal-backdrop"
                        onClick={() => setSelectedJob(null)}
                    >
                        <div
                            className="job-details-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="job-modal-title"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="job-modal-close"
                                onClick={() => setSelectedJob(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <div className="company-logo mb-3">
                                {getCompanyName(selectedJob)
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <h4 id="job-modal-title">
                                {selectedJob.title}
                            </h4>

                            <p className="text-muted">
                                {getCompanyName(selectedJob)}
                            </p>

                            <hr />

                            <p>
                                <strong>Location:</strong>{" "}
                                {selectedJob.location}
                            </p>

                            <p>
                                <strong>Salary:</strong>{" "}
                                {selectedJob.salary}
                            </p>

                            <p>
                                <strong>Job type:</strong>{" "}
                                {getJobType(selectedJob.jobType)}
                            </p>

                            <p>
                                <strong>Application deadline:</strong>{" "}
                                {formatDate(selectedJob.applicationDeadline)}
                            </p>

                            <p className="mt-3">
                                {selectedJob.description}
                            </p>

                            <strong>Required skills</strong>

                            <div className="job-skills mt-2">
                                {(selectedJob.requiredSkills || []).map(
                                    (skill) => (
                                        <span key={skill}>{skill}</span>
                                    )
                                )}
                            </div>

                            <button
                                className="btn btn-primary w-100 mt-4"
                                disabled={
                                    appliedJobIds.includes(selectedJob._id) ||
                                    applyingJobId === selectedJob._id
                                }
                                onClick={() => handleApply(selectedJob)}
                            >
                                {appliedJobIds.includes(selectedJob._id)
                                    ? "Applied ✓"
                                    : applyingJobId === selectedJob._id
                                        ? "Applying..."
                                        : "Apply Now →"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}

export default BrowseJobs;
