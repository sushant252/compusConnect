
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageApplications.css";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Convert backend application data into frontend format
const mapApplication = (app) => ({
  id: app._id,
  studentId: app.student?._id,
  student: app.student?.name || "Unknown Student",
  enrollment: app.student?.enrollmentNumber || "N/A",
  email: app.student?.email || "N/A",
  phone: app.student?.phone || "N/A",
  branch: app.student?.branch || "N/A",
  cgpa: app.student?.cgpa ?? "N/A",

  company: app.job?.company?.name || "Unknown Company",
  job: app.job?.title || "Unknown Job",

  appliedOn: formatDate(app.appliedAt || app.createdAt),
  status: app.status || "Pending",

  coverLetter: app.coverLetter || "",

  // Resume is stored in the Student/User document
  resume: app.student?.resume || app.resume || "",

  jobId: app.job?._id,
});

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch applications when page loads
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/applications");
      const list = response.data.applications || [];

      setApplications(list.map(mapApplication));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // Search and filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = search.toLowerCase();

      const matchesSearch =
        app.student.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query) ||
        app.job.toLowerCase().includes(query) ||
        app.enrollment.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // Application statistics
  const pendingCount = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const selectedCount = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const getStatusClass = (status) =>
    status.toLowerCase().replace(/\s+/g, "-");

  // Update application status
  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await API.put(`/applications/${id}/status`, {
        status: newStatus,
      });

      setApplications((previous) =>
        previous.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );

      setSelectedApplication((previous) =>
        previous?.id === id
          ? { ...previous, status: newStatus }
          : previous
      );

      setSuccess("Application status updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update application status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // View student's uploaded resume
  const handleResume = async (application) => {
    if (!application.resume) {
      setError("Resume is not available for this student.");
      return;
    }

    if (!application.studentId) {
      setError("Student information is not available.");
      return;
    }

    // Open a blank tab immediately to avoid popup blocking
    const resumeWindow = window.open("about:blank", "_blank");

    if (!resumeWindow) {
      setError("Please allow pop-ups to view the student resume.");
      return;
    }

    try {
      setError("");

      const response = await API.get(
        `/admin/students/${application.studentId}/resume`,
        { responseType: "blob" }
      );

      const fileURL = URL.createObjectURL(response.data);

      resumeWindow.location.href = fileURL;

    } catch (err) {
      resumeWindow.close();

      setError(
        err.response?.data?.message ||
        "Unable to open student resume."
      );
    }
  };

  return (
    <AdminLayout
      title="Manage Applications"
      subtitle="Review and manage student placement applications"
    >
      <div className="manage-applications-page">

        {/* Page Heading */}
        <div className="applications-heading">
          <div>
            <h2>Application Management</h2>
            <p>Track and update student job applications.</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Application Statistics */}
        <div className="application-stats-grid">

          <div className="application-stat-card">
            <div>
              <span>Total Applications</span>
              <h3>{applications.length}</h3>
            </div>

            <div className="application-stat-icon blue">
              <i className="bi bi-file-earmark-text"></i>
            </div>
          </div>

          <div className="application-stat-card">
            <div>
              <span>Pending Review</span>
              <h3>{pendingCount}</h3>
            </div>

            <div className="application-stat-icon orange">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>

          <div className="application-stat-card">
            <div>
              <span>Shortlisted</span>
              <h3>{shortlistedCount}</h3>
            </div>

            <div className="application-stat-icon purple">
              <i className="bi bi-star"></i>
            </div>
          </div>

          <div className="application-stat-card">
            <div>
              <span>Selected</span>
              <h3>{selectedCount}</h3>
            </div>

            <div className="application-stat-icon green">
              <i className="bi bi-check-circle"></i>
            </div>
          </div>

        </div>

        {/* Applications Table */}
        <div className="applications-table-card">

          {/* Search and Status Filter */}
          <div className="applications-toolbar">

            <div className="applications-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search student, company or job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Selected">Selected</option>
            </select>

          </div>

          {/* Table */}
          <div className="table-responsive">

            <table className="table applications-admin-table align-middle">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company & Job</th>
                  <th>CGPA</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="6" className="applications-empty">
                      Loading applications...
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>

                      <td>
                        <div className="application-student-name">
                          {app.student}
                        </div>

                        <div className="application-enrollment">
                          {app.enrollment}
                        </div>
                      </td>

                      <td>
                        <div className="application-company">
                          {app.company}
                        </div>

                        <div className="application-job">
                          {app.job}
                        </div>
                      </td>

                      <td>
                        <strong>{app.cgpa}</strong>
                      </td>

                      <td>{app.appliedOn}</td>

                      <td>
                        <span
                          className={`application-status ${getStatusClass(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="application-view-btn"
                          title="View Application"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>

                    </tr>
                  ))
                )}

                {!loading && filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="applications-empty">
                      No applications found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div
            className="application-modal-overlay"
            onClick={() => setSelectedApplication(null)}
          >

            <div
              className="application-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Modal Header */}
              <div className="application-modal-header">

                <div>
                  <h4>Application Details</h4>
                  <p>Review student application information.</p>
                </div>

                <button
                  className="application-modal-close"
                  onClick={() => setSelectedApplication(null)}
                >
                  &times;
                </button>

              </div>

              {/* Student and Job Details */}
              <div className="application-detail-content">

                <div>
                  <span>Student Name</span>
                  <strong>{selectedApplication.student}</strong>
                </div>

                <div>
                  <span>Enrollment Number</span>
                  <strong>{selectedApplication.enrollment}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedApplication.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedApplication.phone}</strong>
                </div>

                <div>
                  <span>Branch</span>
                  <strong>{selectedApplication.branch}</strong>
                </div>

                <div>
                  <span>CGPA</span>
                  <strong>{selectedApplication.cgpa}</strong>
                </div>

                <div>
                  <span>Company</span>
                  <strong>{selectedApplication.company}</strong>
                </div>

                <div>
                  <span>Job Role</span>
                  <strong>{selectedApplication.job}</strong>
                </div>

                <div>
                  <span>Applied On</span>
                  <strong>{selectedApplication.appliedOn}</strong>
                </div>

              </div>

              {/* Cover Letter */}
              <div className="application-cover-letter mt-4">

                <h6>Application Message / Cover Letter</h6>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {selectedApplication.coverLetter || "Not provided"}
                </p>

              </div>

              {/* Student Resume */}
              <div className="application-resume-section mt-4">

                <h6>Student Resume</h6>

                {selectedApplication.resume ? (
                  <div>
                    <p className="text-success mb-2">
                      <i className="bi bi-check-circle-fill"></i>
                      {" "}Resume uploaded
                    </p>

                    <button
                      className="application-view-btn2 mt-2"
                      onClick={() => handleResume(selectedApplication)}
                    >
                      <i className="bi bi-file-earmark-pdf"></i>
                     {" "} View Student Resume
                    </button>
                  </div>
                ) : (
                  <p className="text-muted mb-0">
                    <i className="bi bi-exclamation-circle"></i>
                    {" "}Student has not uploaded a resume.
                  </p>
                )}

              </div>

              {/* Update Application Status */}
              <div className="application-status-update mt-4">

                <label>Update Application Status</label>

                <select
                  value={selectedApplication.status}
                  disabled={updating}
                  onChange={(e) =>
                    updateStatus(
                      selectedApplication.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>

              </div>

              {/* Modal Footer */}
              <div className="application-modal-footer">

                <button
                  onClick={() => setSelectedApplication(null)}
                >
                  Done
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ManageApplications;
