
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageInterviews.css";

const emptyForm = {
  applicationId: "",
  date: "",
  time: "",
  mode: "Online",
  round: "Technical Round",
  meetingLink: "",
  venue: "",
  instructions: "",
};

function ManageInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [interviewsResponse, applicationsResponse] =
        await Promise.all([
          API.get("/interviews"),
          API.get("/applications"),
        ]);

      setInterviews(interviewsResponse.data.interviews || []);
      setApplications(applicationsResponse.data.applications || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load interview data."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (item) =>
    item.student?.name || "Unknown Student";

  const getEnrollment = (item) =>
    item.student?.enrollmentNumber || "Not available";

  const getCompanyName = (item) =>
    item.job?.company?.name || "Company";

  const getJobTitle = (item) =>
    item.job?.title || "Job Role";

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        getStudentName(item).toLowerCase().includes(query) ||
        getCompanyName(item).toLowerCase().includes(query) ||
        getJobTitle(item).toLowerCase().includes(query) ||
        getEnrollment(item).toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);

  const scheduledCount = interviews.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const completedCount = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = interviews.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddInterview = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        applicationId: form.applicationId,
        interviewDate: form.date,
        interviewTime: form.time,
        mode: form.mode,
        round: form.round,
        meetingLink: form.meetingLink,
        venue: form.venue,
        instructions: form.instructions,
      };

      await API.post("/interviews", payload);

      setForm(emptyForm);
      setShowModal(false);
      await fetchData();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        "Failed to schedule interview."
      );
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");

      const response = await API.put(
        `/interviews/${id}/status`,
        { status }
      );

      const updatedInterview = response.data.interview;

      setInterviews((previous) =>
        previous.map((item) =>
          item._id === id ? updatedInterview : item
        )
      );

      setSelectedInterview(updatedInterview);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update interview status."
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setFormError("");
  };

  const openScheduleModal = () => {
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const shortlistedApplications = applications.filter(
    (application) => application.status === "Shortlisted"
  );

  return (
    <AdminLayout
      title="Manage Interviews"
      subtitle="Schedule and track student placement interviews"
    >
      <div className="manage-interviews-page">
        <div className="interviews-heading">
          <div>
            <h2>Interview Management</h2>
            <p>Schedule interviews and monitor student progress.</p>
          </div>

          <button
            className="add-interview-btn"
            onClick={openScheduleModal}
          >
            <i className="bi bi-plus-lg"></i> Schedule Interview
          </button>
        </div>

        <div className="interview-stats-grid">
          <div className="interview-stat-card">
            <span>Total Interviews</span>
            <h3>{interviews.length}</h3>
            <i className="bi bi-calendar-event"></i>
          </div>

          <div className="interview-stat-card">
            <span>Scheduled</span>
            <h3>{scheduledCount}</h3>
            <i className="bi bi-clock-history"></i>
          </div>

          <div className="interview-stat-card">
            <span>Completed</span>
            <h3>{completedCount}</h3>
            <i className="bi bi-check-circle"></i>
          </div>

          <div className="interview-stat-card">
            <span>Cancelled</span>
            <h3>{cancelledCount}</h3>
            <i className="bi bi-x-circle"></i>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchData}
            >
              Retry
            </button>
          </div>
        )}

        <div className="interviews-table-card">
          <div className="interviews-toolbar">
            <div className="interviews-search">
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
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table admin-interviews-table align-middle">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company & Role</th>
                  <th>Date & Time</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="interviews-empty">
                      Loading interviews...
                    </td>
                  </tr>
                ) : filteredInterviews.length > 0 ? (
                  filteredInterviews.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="interview-student-name">
                          {getStudentName(item)}
                        </div>
                        <div className="interview-enrollment">
                          {getEnrollment(item)}
                        </div>
                      </td>

                      <td>
                        <div className="interview-company">
                          {getCompanyName(item)}
                        </div>
                        <div className="interview-role">
                          {getJobTitle(item)}
                        </div>
                      </td>

                      <td>
                        <div>{formatDate(item.interviewDate)}</div>
                        <div className="interview-time">
                          {item.interviewTime}
                        </div>
                      </td>

                      <td>
                        {item.mode === "Offline" ? "On Campus" : item.mode}
                      </td>

                      <td>
                        <span
                          className={`interview-status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <div className="interview-actions">
                          <button
                            className="interview-view-btn"
                            title="View Details"
                            onClick={() => setSelectedInterview(item)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="interviews-empty">
                      No interviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Interview Modal */}
        {showModal && (
          <div className="interview-modal-overlay">
            <div className="interview-modal">
              <div className="interview-modal-header">
                <div>
                  <h4>Schedule New Interview</h4>
                  <p>Select a shortlisted application and enter interview details.</p>
                </div>

                <button
                  className="interview-close-btn"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddInterview}>
                <div className="interview-form-grid">
                  <div className="interview-form-group full-width">
                    <label>Shortlisted Student / Application *</label>
                    <select
                      name="applicationId"
                      value={form.applicationId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select shortlisted application</option>

                      {shortlistedApplications.map((application) => (
                        <option
                          key={application._id}
                          value={application._id}
                        >
                          {application.student?.name || "Student"} —{" "}
                          {application.job?.title || "Job"} —{" "}
                          {application.student?.enrollmentNumber || "No enrollment"}
                        </option>
                      ))}
                    </select>

                    {shortlistedApplications.length === 0 && (
                      <small>
                        No shortlisted applications available.
                      </small>
                    )}
                  </div>

                  <div className="interview-form-group">
                    <label>Interview Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toLocaleDateString("en-CA")}
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Interview Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Interview Mode *</label>
                    <select
                      name="mode"
                      value={form.mode}
                      onChange={handleChange}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">On Campus</option>
                    </select>
                  </div>

                  <div className="interview-form-group">
                    <label>Interview Round *</label>
                    <select
                      name="round"
                      value={form.round}
                      onChange={handleChange}
                    >
                      <option value="Technical Round">Technical Round</option>
                      <option value="HR Round">HR Round</option>
                      <option value="Aptitude Round">Aptitude Round</option>
                      <option value="Final Round">Final Round</option>
                    </select>
                  </div>

                  <div className="interview-form-group full-width">
                    <label>Meeting Link</label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={form.meetingLink}
                      onChange={handleChange}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>

                  <div className="interview-form-group full-width">
                    <label>Venue</label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="Enter interview venue"
                    />
                  </div>

                  <div className="interview-form-group full-width">
                    <label>Instructions</label>
                    <textarea
                      name="instructions"
                      value={form.instructions}
                      onChange={handleChange}
                      placeholder="Enter any instructions for the student"
                      rows="3"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="alert alert-danger mt-3">
                    {formError}
                  </div>
                )}

                <div className="interview-modal-actions">
                  <button
                    type="button"
                    className="interview-cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="interview-save-btn"
                    disabled={saving || shortlistedApplications.length === 0}
                  >
                    {saving ? "Scheduling..." : "Schedule Interview"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Interview Details Modal */}
        {selectedInterview && (
          <div
            className="interview-modal-overlay"
            onClick={() => setSelectedInterview(null)}
          >
            <div
              className="interview-modal interview-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="interview-modal-header">
                <div>
                  <h4>Interview Details</h4>
                  <p>{getStudentName(selectedInterview)}</p>
                </div>

                <button
                  className="interview-close-btn"
                  onClick={() => setSelectedInterview(null)}
                >
                  &times;
                </button>
              </div>

              <div className="interview-detail-list">
                <p>
                  <strong>Enrollment:</strong> {getEnrollment(selectedInterview)}
                </p>
                <p>
                  <strong>Company:</strong> {getCompanyName(selectedInterview)}
                </p>
                <p>
                  <strong>Job Role:</strong> {getJobTitle(selectedInterview)}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedInterview.interviewDate)}
                </p>
                <p>
                  <strong>Time:</strong> {selectedInterview.interviewTime}
                </p>
                <p>
                  <strong>Mode:</strong>{" "}
                  {selectedInterview.mode === "Offline"
                    ? "On Campus"
                    : selectedInterview.mode}
                </p>
                <p>
                  <strong>Round:</strong> {selectedInterview.round}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedInterview.venue || "Not specified"}
                </p>
                <p>
                  <strong>Meeting Link:</strong>{" "}
                  {selectedInterview.meetingLink ? (
                    <a
                      href={selectedInterview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Meeting Link
                    </a>
                  ) : (
                    "Not added"
                  )}
                </p>
                <p>
                  <strong>Instructions:</strong>{" "}
                  {selectedInterview.instructions || "No instructions"}
                </p>
              </div>

              <div className="interview-status-update">
                <label>Update Interview Status</label>
                <select
                  value={selectedInterview.status}
                  onChange={(e) =>
                    updateStatus(selectedInterview._id, e.target.value)
                  }
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="interview-modal-actions">
                <button
                  className="interview-save-btn"
                  onClick={() => setSelectedInterview(null)}
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

export default ManageInterviews;
