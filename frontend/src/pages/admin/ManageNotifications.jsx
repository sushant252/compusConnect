
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageNotifications.css";

const emptyForm = {
  title: "",
  message: "",
  type: "General",
  audience: "All Students",
};

function ManageNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const text = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(text) ||
        item.message.toLowerCase().includes(text) ||
        item.audience.toLowerCase().includes(text);

      const matchesFilter =
        filter === "All" || item.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [notifications, search, filter]);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      setError("Please enter the notification title and message.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const response = await API.post("/notifications", {
        recipientId: "all",
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
      });

      const sentNotification = response.data.notifications?.[0];

      const newNotification = {
        id: sentNotification?._id || Date.now(),
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        audience: "All Students",
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Sent",
      };

      setNotifications((previous) => [
        newNotification,
        ...previous,
      ]);

      setForm(emptyForm);
      setShowModal(false);

      setSuccess(
        response.data.message || "Notification sent successfully!"
      );
    } catch (err) {
      console.error("Send notification error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to send notification. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const getTypeClass = (type) => {
    const classes = {
      Placement: "placement",
      Interview: "interview",
      Application: "job",
      General: "general",
      Important: "important",
    };

    return classes[type] || "general";
  };

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Send and manage student notifications"
    >
      <div className="manage-notifications-page">

        <div className="manage-notifications-heading">
          <div>
            <h2>Manage Notifications</h2>
            <p>Send important updates to students.</p>
          </div>

          <button
            className="send-notification-btn"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowModal(true);
            }}
          >
            <i className="bi bi-send"></i> Send Notification
          </button>
        </div>

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {error && !showModal && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="manage-notification-stats">

          <div className="manage-notification-stat">
            <div className="manage-notification-stat-icon blue">
              <i className="bi bi-bell-fill"></i>
            </div>

            <div>
              <span>Total Notifications</span>
              <h3>{notifications.length}</h3>
            </div>
          </div>

          <div className="manage-notification-stat">
            <div className="manage-notification-stat-icon green">
              <i className="bi bi-send-check-fill"></i>
            </div>

            <div>
              <span>Sent Notifications</span>
              <h3>
                {notifications.filter(
                  (item) => item.status === "Sent"
                ).length}
              </h3>
            </div>
          </div>

          <div className="manage-notification-stat">
            <div className="manage-notification-stat-icon orange">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span>All-Student Notifications</span>
              <h3>
                {notifications.filter(
                  (item) => item.audience === "All Students"
                ).length}
              </h3>
            </div>
          </div>

        </div>

        <div className="manage-notification-toolbar">

          <div className="manage-notification-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="manage-notification-filter"
          >
            <option value="All">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Interview">Interview</option>
            <option value="Application">Application</option>
            <option value="General">General</option>
            <option value="Important">Important</option>
          </select>

        </div>

        <div className="manage-notification-list">

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                className="manage-notification-card"
                key={item.id}
              >
                <div
                  className={`manage-notification-icon ${getTypeClass(item.type)}`}
                >
                  <i
                    className={`bi ${
                      item.type === "Placement"
                        ? "bi-megaphone-fill"
                        : item.type === "Interview"
                        ? "bi-calendar-check-fill"
                        : item.type === "Application"
                        ? "bi-briefcase-fill"
                        : item.type === "Important"
                        ? "bi-exclamation-circle-fill"
                        : "bi-bell-fill"
                    }`}
                  ></i>
                </div>

                <div className="manage-notification-details">

                  <div className="manage-notification-card-heading">
                    <h3>{item.title}</h3>

                    <span className="manage-notification-sent">
                      {item.status}
                    </span>
                  </div>

                  <p>{item.message}</p>

                  <div className="manage-notification-meta">

                    <span className="manage-notification-type">
                      {item.type}
                    </span>

                    <span>
                      <i className="bi bi-people"></i>{" "}
                      {item.audience}
                    </span>

                    <span>
                      <i className="bi bi-calendar3"></i>{" "}
                      {item.date}
                    </span>

                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="manage-notification-empty">
              <i className="bi bi-bell-slash"></i>

              <h3>No notifications found</h3>

              <p>
                Try another search or send a new notification.
              </p>
            </div>
          )}

        </div>
      </div>

      {showModal && (
        <div
          className="manage-notification-modal-backdrop"
          onClick={() => !sending && setShowModal(false)}
        >
          <div
            className="manage-notification-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="manage-notification-modal-header">
              <div>
                <h3>Send Notification</h3>
                <p>Compose a message for students.</p>
              </div>

              <button
                type="button"
                disabled={sending}
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSend}>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <label>Notification Title *</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                maxLength={100}
                required
              />

              <label>Message *</label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your notification message..."
                rows="5"
                maxLength={1000}
                required
              />

              <div className="manage-notification-form-row">

                <div>
                  <label>Notification Type</label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="General">General</option>
                    <option value="Placement">Placement</option>
                    <option value="Application">Application</option>
                    <option value="Interview">Interview</option>
                    <option value="Important">Important</option>
                  </select>
                </div>

                <div>
                  <label>Target Audience</label>

                  <select
                    name="audience"
                    value={form.audience}
                    onChange={handleChange}
                  >
                    <option value="All Students">
                      All Students
                    </option>
                  </select>
                </div>

              </div>

              <div className="manage-notification-modal-actions">

                <button
                  type="button"
                  className="manage-notification-cancel"
                  disabled={sending}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="manage-notification-submit"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i> Send Notification
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

export default ManageNotifications;
