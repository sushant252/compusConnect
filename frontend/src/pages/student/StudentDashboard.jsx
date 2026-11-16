
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState([
    { title: "Available Jobs", value: 0, icon: "💼", color: "blue" },
    { title: "Applied Jobs", value: 0, icon: "📄", color: "purple" },
    { title: "Shortlisted", value: 0, icon: "⭐", color: "green" },
    { title: "Interviews", value: 0, icon: "📅", color: "orange" },
  ]);

  const [jobsLoading, setJobsLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setJobsLoading(true);
        setDashboardLoading(true);
        setJobsError("");

        const [jobsResult, applicationsResult, interviewsResult] =
          await Promise.allSettled([
            API.get("/jobs"),
            API.get("/applications/my"),
            API.get("/interviews/my"),
          ]);

        let availableJobs = [];
        let studentApplications = [];
        let studentInterviews = [];

        // Available Jobs
        if (jobsResult.status === "fulfilled") {
          const allJobs = jobsResult.value.data.jobs || [];

          availableJobs = allJobs.filter((job) => {
            const deadline = new Date(job.applicationDeadline);

            return (
              job.status === "Open" &&
              deadline >= new Date()
            );
          });

          setJobs(availableJobs.slice(0, 3));
        } else {
          setJobsError(
            jobsResult.reason.response?.data?.message ||
            "Unable to load recommended jobs."
          );
        }

        // Student Applications
        if (applicationsResult.status === "fulfilled") {
          studentApplications =
            applicationsResult.value.data.applications || [];

          setApplications(studentApplications);
        }

        // Student Interviews
        if (interviewsResult.status === "fulfilled") {
          studentInterviews =
            interviewsResult.value.data.interviews || [];
        }

        // Calculate Dashboard Statistics
        const shortlistedCount = studentApplications.filter(
          (application) => application.status === "Shortlisted"
        ).length;

        setStats([
          {
            title: "Available Jobs",
            value: availableJobs.length,
            icon: "💼",
            color: "blue",
          },
          {
            title: "Applied Jobs",
            value: studentApplications.length,
            icon: "📄",
            color: "purple",
          },
          {
            title: "Shortlisted",
            value: shortlistedCount,
            icon: "⭐",
            color: "green",
          },
          {
            title: "Interviews",
            value: studentInterviews.length,
            icon: "📅",
            color: "orange",
          },
        ]);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setJobsLoading(false);
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <StudentLayout
      title="Student Dashboard"
      subtitle="Welcome back! Here's your placement overview."
    >
      <div className="student-layout">

        {/* Main Content */}
        <main className="student-main">

          <div className="dashboard-content">

            {/* Welcome */}
            <section className="welcome-banner">
              <div>
                <span className="welcome-label">STUDENT PORTAL</span>

                <h2>Welcome back, {user?.name || "Student"}! 👋</h2>

                <p>
                  Keep moving forward. Your dream career starts here.
                </p>

                <Link
                  to="/student/jobs"
                  className="btn btn-light fw-semibold mt-2"
                >
                  Explore Jobs →
                </Link>
              </div>

              <div className="welcome-illustration">🎓</div>
            </section>

            {/* Statistics */}
            <section className="mt-4">
              <div className="section-heading">
                <h5>Placement Overview</h5>
                <span>Academic Year 2026–27</span>
              </div>

              <div className="row g-3">
                {stats.map((item) => (
                  <div
                    className="col-12 col-sm-6 col-xl-3"
                    key={item.title}
                  >
                    <div className="stat-card">
                      <div className={`stat-icon ${item.color}`}>
                        {item.icon}
                      </div>

                      <p>{item.title}</p>

                      <h3>
                        {dashboardLoading ? "..." : item.value}
                      </h3>

                      <small>Current academic year</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section className="mt-4">
              <div className="section-heading">
                <h5>Recommended Jobs</h5>
                <Link to="/student/jobs">View all jobs →</Link>
              </div>

              <div className="row g-3">

                {jobsLoading && (
                  <div className="col-12 text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>

                    <p className="text-muted mt-2">
                      Loading recommended jobs...
                    </p>
                  </div>
                )}

                {!jobsLoading && jobsError && (
                  <div className="col-12">
                    <div className="alert alert-danger">
                      {jobsError}
                    </div>
                  </div>
                )}

                {!jobsLoading && !jobsError && jobs.length === 0 && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      No open jobs are currently available.
                    </div>
                  </div>
                )}

                {!jobsLoading && !jobsError && jobs.map((job) => (
                  <div className="col-12 col-lg-4" key={job._id}>
                    <div className="job-card">

                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="company-logo">
                          {job.company?.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <h6 className="mb-1 fw-bold">
                            {job.title}
                          </h6>

                          <small className="text-muted">
                            {job.company?.name || "Company"}
                          </small>
                        </div>
                      </div>

                      <div className="job-details">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary || "Not disclosed"}</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Deadline: {formatDate(job.applicationDeadline)}
                        </small>

                        <Link
                          to="/student/jobs"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Job
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* Recent Activity */}
            <section className="mt-4">
              <div className="section-heading">
                <h5>Recent Application Activity</h5>
                <Link to="/student/applications">View all →</Link>
              </div>

              <div className="activity-card">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            No application activity yet.
                          </td>
                        </tr>
                      ) : (
                        applications.slice(0, 3).map((application) => (
                          <tr key={application._id}>
                            <td>
                              {application.job?.company?.name || "Company"}
                            </td>

                            <td>
                              {application.job?.title || "Job"}
                            </td>

                            <td>
                              {formatDate(
                                application.appliedAt || application.createdAt
                              )}
                            </td>

                            <td>
                              <span
                                className={`status-badge ${
                                  application.status?.toLowerCase() || "pending"
                                }`}
                              >
                                {application.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <footer className="dashboard-footer">
              © 2026 CampusConnect. All rights reserved.
            </footer>

          </div>
        </main>
      </div>
    </StudentLayout>
  );
}

export default StudentDashboard;
