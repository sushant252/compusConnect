
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./ManageInterviews.css";

const initialInterviews = [
  {
    id: 1,
    student: "Rahul Sharma",
    enrollment: "CC2022001",
    company: "Tech Solutions",
    role: "Frontend Developer",
    date: "2026-11-18",
    time: "10:30",
    mode: "Online",
    round: "Technical Round",
    status: "Scheduled",
    venue: "Google Meet",
  },
  {
    id: 2,
    student: "Priya Verma",
    enrollment: "CC2022002",
    company: "Innovate Labs",
    role: "Software Engineer",
    date: "2026-11-20",
    time: "14:00",
    mode: "Online",
    round: "HR Round",
    status: "Scheduled",
    venue: "Microsoft Teams",
  },
  {
    id: 3,
    student: "Aman Gupta",
    enrollment: "CC2022003",
    company: "CloudTech",
    role: "Backend Developer",
    date: "2026-11-10",
    time: "11:00",
    mode: "On Campus",
    round: "Technical Round",
    status: "Completed",
    venue: "College Seminar Hall",
  },
  {
    id: 4,
    student: "Sneha Singh",
    enrollment: "CC2022004",
    company: "Digital Systems",
    role: "React Developer",
    date: "2026-11-22",
    time: "12:00",
    mode: "Online",
    round: "HR Round",
    status: "Cancelled",
    venue: "Google Meet",
  },
];

const emptyForm = {
  student: "",
  enrollment: "",
  company: "",
  role: "",
  date: "",
  time: "",
  mode: "Online",
  round: "Technical Round",
  venue: "",
};

function ManageInterviews() {
  const [interviews, setInterviews] = useState(initialInterviews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.student.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.enrollment.toLowerCase().includes(query);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddInterview = (e) => {
    e.preventDefault();

    const newInterview = {
      ...form,
      id: Date.now(),
      status: "Scheduled",
    };

    setInterviews((previous) => [newInterview, ...previous]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    setInterviews((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedInterview((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      setInterviews((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (selectedInterview?.id === id) {
        setSelectedInterview(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

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
            onClick={() => setShowModal(true)}
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
                {filteredInterviews.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="interview-student-name">
                        {item.student}
                      </div>
                      <div className="interview-enrollment">
                        {item.enrollment}
                      </div>
                    </td>

                    <td>
                      <div className="interview-company">{item.company}</div>
                      <div className="interview-role">{item.role}</div>
                    </td>

                    <td>
                      <div>{item.date}</div>
                      <div className="interview-time">{item.time}</div>
                    </td>

                    <td>{item.mode}</td>

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

                        <button
                          className="interview-delete-btn"
                          title="Delete Interview"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredInterviews.length === 0 && (
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

        {showModal && (
          <div className="interview-modal-overlay">
            <div className="interview-modal">
              <div className="interview-modal-header">
                <div>
                  <h4>Schedule New Interview</h4>
                  <p>Enter student and interview details.</p>
                </div>

                <button className="interview-close-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddInterview}>
                <div className="interview-form-grid">
                  <div className="interview-form-group">
                    <label>Student Name *</label>
                    <input
                      name="student"
                      value={form.student}
                      onChange={handleChange}
                      placeholder="Student name"
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Enrollment Number *</label>
                    <input
                      name="enrollment"
                      value={form.enrollment}
                      onChange={handleChange}
                      placeholder="CC2022001"
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Company *</label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company name"
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Job Role *</label>
                    <input
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="Job title"
                      required
                    />
                  </div>

                  <div className="interview-form-group">
                    <label>Interview Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
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
                      <option value="On Campus">On Campus</option>
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
                    <label>Venue / Meeting Link *</label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="Enter venue or meeting link"
                      required
                    />
                  </div>
                </div>

                <div className="interview-modal-actions">
                  <button
                    type="button"
                    className="interview-cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="interview-save-btn">
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  <p>{selectedInterview.student}</p>
                </div>

                <button
                  className="interview-close-btn"
                  onClick={() => setSelectedInterview(null)}
                >
                  &times;
                </button>
              </div>

              <div className="interview-detail-list">
                <p><strong>Enrollment:</strong> {selectedInterview.enrollment}</p>
                <p><strong>Company:</strong> {selectedInterview.company}</p>
                <p><strong>Job Role:</strong> {selectedInterview.role}</p>
                <p><strong>Date:</strong> {selectedInterview.date}</p>
                <p><strong>Time:</strong> {selectedInterview.time}</p>
                <p><strong>Mode:</strong> {selectedInterview.mode}</p>
                <p><strong>Round:</strong> {selectedInterview.round}</p>
                <p><strong>Venue / Link:</strong> {selectedInterview.venue}</p>
              </div>

              <div className="interview-status-update">
                <label>Update Interview Status</label>
                <select
                  value={selectedInterview.status}
                  onChange={(e) =>
                    updateStatus(selectedInterview.id, e.target.value)
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
