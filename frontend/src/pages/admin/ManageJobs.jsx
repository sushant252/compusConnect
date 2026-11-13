
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./ManageJobs.css";

const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Noida",
    type: "Full Time",
    package: "6 LPA",
    deadline: "2026-11-25",
    status: "Active",
    eligibility: "B.Tech, CS/IT, CGPA 7.0+",
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Innovate Labs",
    location: "Bangalore",
    type: "Full Time",
    package: "8 LPA",
    deadline: "2026-11-28",
    status: "Active",
    eligibility: "B.Tech, All Branches, CGPA 7.5+",
  },
  {
    id: 3,
    title: "React Developer",
    company: "Digital Systems",
    location: "Gurugram",
    type: "Internship",
    package: "5 LPA",
    deadline: "2026-11-30",
    status: "Active",
    eligibility: "B.Tech, CS/IT",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudTech",
    location: "Pune",
    type: "Full Time",
    package: "7 LPA",
    deadline: "2026-12-05",
    status: "Closed",
    eligibility: "B.Tech, CS/IT, CGPA 7.0+",
  },
];

const emptyForm = {
  title: "",
  company: "",
  location: "",
  type: "Full Time",
  package: "",
  deadline: "",
  eligibility: "",
};

function ManageJobs() {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      const matchesType =
        typeFilter === "All" || job.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jobs, search, statusFilter, typeFilter]);

  const activeCount = jobs.filter((job) => job.status === "Active").length;
  const closedCount = jobs.filter((job) => job.status === "Closed").length;

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddJob = (e) => {
    e.preventDefault();

    const newJob = {
      ...form,
      id: Date.now(),
      status: "Active",
    };

    setJobs([newJob, ...jobs]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <AdminLayout
      title="Manage Jobs"
      subtitle="Create and manage placement opportunities"
    >
      <div className="manage-jobs-page">
        <div className="jobs-page-heading">
          <div>
            <h2>Job Management</h2>
            <p>Manage all job openings posted by companies.</p>
          </div>

          <button
            className="add-job-btn"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg"></i> Add New Job
          </button>
        </div>

        <div className="jobs-stats-grid">
          <div className="jobs-stat-card">
            <span>Total Jobs</span>
            <h3>{jobs.length}</h3>
            <i className="bi bi-briefcase-fill"></i>
          </div>

          <div className="jobs-stat-card">
            <span>Active Jobs</span>
            <h3>{activeCount}</h3>
            <i className="bi bi-check-circle-fill"></i>
          </div>

          <div className="jobs-stat-card">
            <span>Closed Jobs</span>
            <h3>{closedCount}</h3>
            <i className="bi bi-lock-fill"></i>
          </div>
        </div>

        <div className="jobs-table-card">
          <div className="jobs-filter-row">
            <div className="jobs-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search job, company or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table jobs-admin-table align-middle">
              <thead>
                <tr>
                  <th>Job Details</th>
                  <th>Location</th>
                  <th>Package</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="admin-job-title">{job.title}</div>
                      <div className="admin-job-company">{job.company}</div>
                      <span className="admin-job-type">{job.type}</span>
                    </td>

                    <td>{job.location}</td>
                    <td className="job-package">{job.package}</td>
                    <td>{job.deadline}</td>

                    <td>
                      <span
                        className={`job-status ${
                          job.status === "Active" ? "active" : "closed"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <div className="job-action-buttons">
                        <button
                          className="job-view-btn"
                          title="View Details"
                          onClick={() => setSelectedJob(job)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="job-delete-btn"
                          title="Delete Job"
                          onClick={() => handleDelete(job.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="jobs-empty-state">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="jobs-modal-overlay">
            <div className="jobs-modal">
              <div className="jobs-modal-header">
                <div>
                  <h4>Add New Job</h4>
                  <p>Enter the job opening details.</p>
                </div>
                <button onClick={closeModal} className="modal-close-btn">
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddJob}>
                <div className="jobs-form-grid">
                  <div className="jobs-form-group">
                    <label>Job Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Company Name *</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleFormChange}
                      placeholder="Company name"
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Location *</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleFormChange}
                      placeholder="e.g. Noida"
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Job Type *</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                    >
                      <option>Full Time</option>
                      <option>Internship</option>
                    </select>
                  </div>

                  <div className="jobs-form-group">
                    <label>Package *</label>
                    <input
                      name="package"
                      value={form.package}
                      onChange={handleFormChange}
                      placeholder="e.g. 6 LPA"
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Application Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="jobs-form-group full-width">
                    <label>Eligibility Criteria *</label>
                    <textarea
                      name="eligibility"
                      value={form.eligibility}
                      onChange={handleFormChange}
                      placeholder="Enter branch, CGPA and other requirements"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                <div className="jobs-modal-actions">
                  <button
                    type="button"
                    className="jobs-cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="jobs-save-btn">
                    Add Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedJob && (
          <div
            className="jobs-modal-overlay"
            onClick={() => setSelectedJob(null)}
          >
            <div
              className="jobs-modal job-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="jobs-modal-header">
                <div>
                  <h4>{selectedJob.title}</h4>
                  <p>{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="modal-close-btn"
                >
                  &times;
                </button>
              </div>

              <div className="job-detail-list">
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Job Type:</strong> {selectedJob.type}</p>
                <p><strong>Package:</strong> {selectedJob.package}</p>
                <p><strong>Deadline:</strong> {selectedJob.deadline}</p>
                <p><strong>Status:</strong> {selectedJob.status}</p>
                <p>
                  <strong>Eligibility:</strong>{" "}
                  {selectedJob.eligibility}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageJobs;
