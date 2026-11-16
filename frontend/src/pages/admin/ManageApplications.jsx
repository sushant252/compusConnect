
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
  resume: app.resume || "",
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

  const handleResume = async (application) => {
    if (!application.resume) {
      setError("Resume is not available for this application.");
      return;
    }

    try {
      setError("");

      const response = await API.get(
        `/admin/students/${application.studentId}/resume`,
        { responseType: "blob" }
      );

      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (err) {
      setError("Unable to open student resume.");
    }
  };

  return (
    <AdminLayout
      title="Manage Applications"
      subtitle="Review and manage student placement applications"
    >
      <div className="manage-applications-page">
        <div className="applications-heading">
          <div>
            <h2>Application Management</h2>
            <p>Track and update student job applications.</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

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

        <div className="applications-table-card">
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
                ) : filteredApplications.map((app) => (
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
                      <div className="application-job">{app.job}</div>
                    </td>

                    <td><strong>{app.cgpa}</strong></td>
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
                ))}

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

        {selectedApplication && (
          <div
            className="application-modal-overlay"
            onClick={() => setSelectedApplication(null)}
          >
            <div
              className="application-modal"
              onClick={(e) => e.stopPropagation()}
            >
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

                <div>
                  <span>Cover Letter</span>
                  <strong>
                    {selectedApplication.coverLetter || "Not provided"}
                  </strong>
                </div>
              </div>

              {selectedApplication.resume && (
                <button
                  className="application-view-btn mt-3"
                  onClick={() => handleResume(selectedApplication)}
                >
                  <i className="bi bi-file-earmark-pdf"></i> View Resume
                </button>
              )}

              <div className="application-status-update">
                <label>Update Application Status</label>

                <select
                  value={selectedApplication.status}
                  disabled={updating}
                  onChange={(e) =>
                    updateStatus(selectedApplication.id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>

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
