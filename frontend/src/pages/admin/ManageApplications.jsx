
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./ManageApplications.css";

const initialApplications = [
  {
    id: 1,
    student: "Rahul Sharma",
    enrollment: "CC2022001",
    company: "Tech Solutions",
    job: "Frontend Developer",
    appliedOn: "10 Nov 2026",
    cgpa: "8.5",
    status: "Shortlisted",
  },
  {
    id: 2,
    student: "Priya Verma",
    enrollment: "CC2022002",
    company: "Innovate Labs",
    job: "Software Engineer",
    appliedOn: "11 Nov 2026",
    cgpa: "9.1",
    status: "Pending",
  },
  {
    id: 3,
    student: "Aman Gupta",
    enrollment: "CC2022003",
    company: "Digital Systems",
    job: "React Developer",
    appliedOn: "12 Nov 2026",
    cgpa: "7.8",
    status: "Rejected",
  },
  {
    id: 4,
    student: "Sneha Singh",
    enrollment: "CC2022004",
    company: "CloudTech",
    job: "Backend Developer",
    appliedOn: "13 Nov 2026",
    cgpa: "8.9",
    status: "Selected",
  },
  {
    id: 5,
    student: "Arjun Patel",
    enrollment: "CC2022005",
    company: "Tech Solutions",
    job: "Frontend Developer",
    appliedOn: "14 Nov 2026",
    cgpa: "7.6",
    status: "Pending",
  },
  {
    id: 6,
    student: "Neha Kumari",
    enrollment: "CC2022006",
    company: "Innovate Labs",
    job: "Software Engineer",
    appliedOn: "14 Nov 2026",
    cgpa: "8.7",
    status: "Shortlisted",
  },
];

function ManageApplications() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  const updateStatus = (id, newStatus) => {
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
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
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
                {filteredApplications.map((app) => (
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
                      <div className="application-company">{app.company}</div>
                      <div className="application-job">{app.job}</div>
                    </td>

                    <td>
                      <strong>{app.cgpa}</strong>
                    </td>

                    <td>{app.appliedOn}</td>

                    <td>
                      <span
                        className={`application-status ${getStatusClass(
                          app.status
                        )}`}
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

                {filteredApplications.length === 0 && (
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
                  <span>Company</span>
                  <strong>{selectedApplication.company}</strong>
                </div>

                <div>
                  <span>Job Role</span>
                  <strong>{selectedApplication.job}</strong>
                </div>

                <div>
                  <span>CGPA</span>
                  <strong>{selectedApplication.cgpa}</strong>
                </div>

                <div>
                  <span>Applied On</span>
                  <strong>{selectedApplication.appliedOn}</strong>
                </div>
              </div>

              <div className="application-status-update">
                <label>Update Application Status</label>

                <select
                  value={selectedApplication.status}
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
