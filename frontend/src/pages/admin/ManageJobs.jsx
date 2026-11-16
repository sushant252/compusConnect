
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageJobs.css";

const emptyForm = {
  title: "",
  company: "",
  description: "",
  location: "",
  jobType: "Full Time",
  salary: "",
  deadline: "",
  minCGPA: "0",
  branches: "",
  graduationYears: "",
  requiredSkills: "",
  vacancies: "1",
  status: "Open",
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const getJobStatus = (status) =>
  status === "Open" ? "Active" : "Closed";

const mapJob = (job) => ({
  id: job._id,
  title: job.title || "",
  company: job.company?.name || "Unknown Company",
  companyId: job.company?._id || job.company || "",
  location: job.location || "",
  type: job.jobType || "Full Time",
  package: job.salary || "Not disclosed",
  deadline: formatDate(job.applicationDeadline),
  status: getJobStatus(job.status),
  description: job.description || "",
  eligibility: job.eligibility || {},
  requiredSkills: job.requiredSkills || [],
  vacancies: job.vacancies || 1,
});

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobResponse, companyResponse] = await Promise.all([
        API.get("/jobs"),
        API.get("/companies"),
      ]);

      const jobList = jobResponse.data.jobs || [];

      const companyList = companyResponse.data.companies ||
        (Array.isArray(companyResponse.data)
          ? companyResponse.data
          : []);

      setJobs(jobList.map(mapJob));
      setCompanies(companyList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load jobs and companies."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const activeCount = jobs.filter(
    (job) => job.status === "Active"
  ).length;

  const closedCount = jobs.filter(
    (job) => job.status === "Closed"
  ).length;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title,
      company: job.companyId,
      description: job.description,
      location: job.location,
      jobType: job.type,
      salary: job.package,
      deadline: job.deadline,
      minCGPA: String(job.eligibility?.minCGPA ?? 0),
      branches: (job.eligibility?.branches || []).join(", "),
      graduationYears: (
        job.eligibility?.graduationYears || []
      ).join(", "),
      requiredSkills: (job.requiredSkills || []).join(", "),
      vacancies: String(job.vacancies || 1),
      status: job.status === "Active" ? "Open" : "Closed",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title.trim(),
        company: form.company,
        description: form.description.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        salary: form.salary.trim() || "Not disclosed",
        applicationDeadline: form.deadline,
        eligibility: {
          minCGPA: Number(form.minCGPA) || 0,
          branches: form.branches
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          graduationYears: form.graduationYears
            .split(",")
            .map((item) => Number(item.trim()))
            .filter((item) => Number.isInteger(item) && item > 0),
        },
        requiredSkills: form.requiredSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        vacancies: Number(form.vacancies),
        status: form.status,
      };

      if (editingJob) {
        await API.put(`/jobs/${editingJob.id}`, payload);
        setSuccess("Job updated successfully!");
      } else {
        await API.post("/jobs", payload);
        setSuccess("Job added successfully!");
      }

      closeModal();
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save job."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      setError("");
      await API.delete(`/jobs/${id}`);

      setJobs((previous) =>
        previous.filter((job) => job.id !== id)
      );

      setSuccess("Job deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete job."
      );
    }
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

          <button className="add-job-btn" onClick={openAddModal}>
            <i className="bi bi-plus-lg"></i> Add New Job
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

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
              <option value="Part Time">Part Time</option>
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="jobs-empty-state">
                      Loading jobs...
                    </td>
                  </tr>
                ) : filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="admin-job-title">{job.title}</div>
                      <div className="admin-job-company">
                        {job.company}
                      </div>
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
                          className="job-view-btn"
                          title="Edit Job"
                          onClick={() => openEditModal(job)}
                        >
                          <i className="bi bi-pencil"></i>
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

                {!loading && filteredJobs.length === 0 && (
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
                  <h4>{editingJob ? "Edit Job" : "Add New Job"}</h4>
                  <p>Enter the job opening details.</p>
                </div>

                <button onClick={closeModal} className="modal-close-btn">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveJob}>
                <div className="jobs-form-grid">
                  <div className="jobs-form-group">
                    <label>Job Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Company *</label>
                    <select
                      name="company"
                      value={form.company}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="jobs-form-group">
                    <label>Location *</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Job Type *</label>
                    <select
                      name="jobType"
                      value={form.jobType}
                      onChange={handleFormChange}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part Time">Part Time</option>
                    </select>
                  </div>

                  <div className="jobs-form-group">
                    <label>Package / Salary</label>
                    <input
                      name="salary"
                      value={form.salary}
                      onChange={handleFormChange}
                      placeholder="e.g. 6 LPA"
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Application Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleFormChange}
                      min={formatDate(new Date())}
                      required
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Minimum CGPA</label>
                    <input
                      type="number"
                      name="minCGPA"
                      value={form.minCGPA}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Vacancies *</label>
                    <input
                      type="number"
                      name="vacancies"
                      value={form.vacancies}
                      onChange={handleFormChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="jobs-form-group full-width">
                    <label>Job Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      rows="3"
                      required
                    />
                  </div>

                  <div className="jobs-form-group full-width">
                    <label>Eligible Branches</label>
                    <input
                      name="branches"
                      value={form.branches}
                      onChange={handleFormChange}
                      placeholder="e.g. CS, IT, ECE (comma separated)"
                    />
                  </div>

                  <div className="jobs-form-group full-width">
                    <label>Eligible Graduation Years</label>
                    <input
                      name="graduationYears"
                      value={form.graduationYears}
                      onChange={handleFormChange}
                      placeholder="e.g. 2026, 2027"
                    />
                  </div>

                  <div className="jobs-form-group full-width">
                    <label>Required Skills</label>
                    <input
                      name="requiredSkills"
                      value={form.requiredSkills}
                      onChange={handleFormChange}
                      placeholder="e.g. React, JavaScript, HTML"
                    />
                  </div>

                  <div className="jobs-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                    >
                      <option value="Open">Active / Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}

                <div className="jobs-modal-actions">
                  <button
                    type="button"
                    className="jobs-cancel-btn"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="jobs-save-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingJob
                        ? "Update Job"
                        : "Add Job"}
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
                <p><strong>Description:</strong> {selectedJob.description}</p>
                <p>
                  <strong>Minimum CGPA:</strong>{" "}
                  {selectedJob.eligibility?.minCGPA ?? 0}
                </p>
                <p>
                  <strong>Eligible Branches:</strong>{" "}
                  {(selectedJob.eligibility?.branches || []).join(", ") || "All"}
                </p>
                <p>
                  <strong>Graduation Years:</strong>{" "}
                  {(selectedJob.eligibility?.graduationYears || []).join(", ") || "All"}
                </p>
                <p>
                  <strong>Required Skills:</strong>{" "}
                  {(selectedJob.requiredSkills || []).join(", ") || "Not specified"}
                </p>
                <p><strong>Vacancies:</strong> {selectedJob.vacancies}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageJobs;
