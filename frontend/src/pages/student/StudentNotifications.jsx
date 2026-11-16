
import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./StudentNotifications.css";

function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/notifications/my");

      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter((item) => !item.isRead);
    }

    if (filter === "Read") {
      return notifications.filter((item) => item.isRead);
    }

    return notifications;
  }, [notifications, filter]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not mark notification as read."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTypeClass = (type) => {
    const classes = {
      Application: "application",
      Interview: "interview",
      Placement: "job",
      Important: "announcement",
      General: "application",
    };

    return classes[type] || "application";
  };

  const getTypeIcon = (type) => {
    const icons = {
      Application: "bi-check-circle-fill",
      Interview: "bi-calendar-check-fill",
      Placement: "bi-briefcase-fill",
      Important: "bi-megaphone-fill",
      General: "bi-bell-fill",
    };

    return icons[type] || "bi-bell-fill";
  };

  return (
    <StudentLayout
      title="Notifications"
      subtitle="Stay informed about your placement activities"
      contentClassName="student-notifications-page"
    >
      <div className="student-layout">
        <main className="student-main">
          <div className="student-notifications-page">

            <div className="notification-welcome">
              <div>
                <span className="notification-eyebrow">
                  YOUR NOTIFICATION CENTER
                </span>
                <h2>Stay in the loop!</h2>
                <p>
                  Never miss an important placement update, interview reminder
                  or application status change.
                </p>
              </div>

              <div className="notification-welcome-icon">
                <i className="bi bi-bell-fill"></i>
                {unreadCount > 0 && (
                  <span className="notification-welcome-count">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            <div className="notification-stats">
              <div className="notification-stat-card">
                <div className="notification-stat-icon blue">
                  <i className="bi bi-bell"></i>
                </div>
                <div>
                  <span>Total Notifications</span>
                  <h3>{notifications.length}</h3>
                </div>
              </div>

              <div className="notification-stat-card">
                <div className="notification-stat-icon orange">
                  <i className="bi bi-envelope"></i>
                </div>
                <div>
                  <span>Unread</span>
                  <h3>{unreadCount}</h3>
                </div>
              </div>

              <div className="notification-stat-card">
                <div className="notification-stat-icon green">
                  <i className="bi bi-envelope-open"></i>
                </div>
                <div>
                  <span>Read</span>
                  <h3>{notifications.length - unreadCount}</h3>
                </div>
              </div>
            </div>

            <div className="notification-toolbar">
              <div>
                <h3>All Notifications</h3>
                <p>You have {unreadCount} unread notification(s).</p>
              </div>

              <div className="notification-toolbar-actions">
                <button
                  className="notification-mark-all"
                  onClick={() => {
                    alert("Mark all as read will be available after backend support is added.");
                  }}
                  disabled={unreadCount === 0}
                >
                  <i className="bi bi-check2-all"></i> Mark all as read
                </button>

                <button
                  className="notification-clear-all"
                  onClick={() => {
                    alert("Clear all will be available after backend support is added.");
                  }}
                  disabled={notifications.length === 0}
                >
                  <i className="bi bi-trash"></i> Clear all
                </button>
              </div>
            </div>

            <div className="notification-filter-tabs">
              {["All", "Unread", "Read"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                  {item === "Unread" && unreadCount > 0 && (
                    <span>{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="notification-list">
              {loading ? (
                <div className="notification-empty">
                  <h3>Loading notifications...</h3>
                </div>
              ) : error ? (
                <div className="notification-empty">
                  <h3>Unable to load notifications</h3>
                  <p>{error}</p>
                  <button onClick={fetchNotifications}>
                    Try Again
                  </button>
                </div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => (
                  <div
                    className={`notification-card ${
                      !item.isRead ? "unread" : ""
                    }`}
                    key={item._id}
                  >
                    <div
                      className={`notification-card-icon ${getTypeClass(
                        item.type
                      )}`}
                    >
                      <i className={`bi ${getTypeIcon(item.type)}`}></i>
                    </div>

                    <div className="notification-card-content">
                      <div className="notification-card-heading">
                        <h4>{item.title}</h4>
                        {!item.isRead && (
                          <span className="notification-new">New</span>
                        )}
                      </div>

                      <p>{item.message}</p>

                      <div className="notification-card-meta">
                        <span className="notification-type">
                          {item.type}
                        </span>
                        <span>
                          <i className="bi bi-clock"></i>{" "}
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="notification-card-actions">
                      <button
                        title="Mark as read"
                        onClick={() => markAsRead(item._id)}
                        disabled={item.isRead}
                      >
                        <i className="bi bi-check2"></i>
                      </button>

                      <button
                        title="Delete notification (not available yet)"
                        className="notification-delete"
                        disabled
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-empty">
                  <i className="bi bi-bell-slash"></i>
                  <h3>No notifications found</h3>
                  <p>
                    {filter === "Unread"
                      ? "You are all caught up! There are no unread notifications."
                      : "There are no notifications in this section."}
                  </p>

                  {filter !== "All" && (
                    <button onClick={() => setFilter("All")}>
                      View All Notifications
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </StudentLayout>
  );
}

export default StudentNotifications;
