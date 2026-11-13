
import { useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "./StudentNotifications.css";

const initialNotifications = [
  {
    id: 1,
    title: "Application Shortlisted!",
    message:
      "Congratulations! Your application for Frontend Developer at Tech Solutions has been shortlisted.",
    type: "Application",
    date: "14 Nov 2026, 10:30 AM",
    icon: "bi-check-circle-fill",
    read: false,
  },
  {
    id: 2,
    title: "Interview Scheduled",
    message:
      "Your technical interview with Tech Solutions is scheduled for 18 November 2026 at 10:30 AM.",
    type: "Interview",
    date: "14 Nov 2026, 09:15 AM",
    icon: "bi-calendar-check-fill",
    read: false,
  },
  {
    id: 3,
    title: "New Job Opportunity",
    message:
      "A new Software Engineer position has been posted by Innovate Labs. Check eligibility and apply.",
    type: "Job",
    date: "13 Nov 2026, 04:00 PM",
    icon: "bi-briefcase-fill",
    read: false,
  },
  {
    id: 4,
    title: "Application Status Updated",
    message:
      "Your application for Backend Developer at CloudTech is now under review.",
    type: "Application",
    date: "12 Nov 2026, 02:30 PM",
    icon: "bi-arrow-repeat",
    read: true,
  },
  {
    id: 5,
    title: "Placement Announcement",
    message:
      "Registration is open for the Campus Placement Drive 2026. Complete your profile before applying.",
    type: "Announcement",
    date: "11 Nov 2026, 11:00 AM",
    icon: "bi-megaphone-fill",
    read: true,
  },
  {
    id: 6,
    title: "Interview Reminder",
    message:
      "Reminder: Your HR interview with Innovate Labs is scheduled for 20 November 2026 at 02:00 PM.",
    type: "Interview",
    date: "10 Nov 2026, 09:00 AM",
    icon: "bi-clock-fill",
    read: true,
  },
];

function StudentNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "Unread") {
      return notifications.filter((item) => !item.read);
    }

    if (filter === "Read") {
      return notifications.filter((item) => item.read);
    }

    return notifications;
  }, [notifications, filter]);

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearAllNotifications = () => {
    if (notifications.length === 0) return;

    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const getTypeClass = (type) => {
    const classes = {
      Application: "application",
      Interview: "interview",
      Job: "job",
      Announcement: "announcement",
    };

    return classes[type] || "application";
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
            <span className="notification-eyebrow">YOUR NOTIFICATION CENTER</span>
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
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <i className="bi bi-check2-all"></i> Mark all as read
            </button>

            <button
              className="notification-clear-all"
              onClick={clearAllNotifications}
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                className={`notification-card ${!item.read ? "unread" : ""}`}
                key={item.id}
              >
                <div className={`notification-card-icon ${getTypeClass(item.type)}`}>
                  <i className={`bi ${item.icon}`}></i>
                </div>

                <div className="notification-card-content">
                  <div className="notification-card-heading">
                    <h4>{item.title}</h4>
                    {!item.read && <span className="notification-new">New</span>}
                  </div>

                  <p>{item.message}</p>

                  <div className="notification-card-meta">
                    <span className="notification-type">
                      {item.type}
                    </span>
                    <span>
                      <i className="bi bi-clock"></i> {item.date}
                    </span>
                  </div>
                </div>

                <div className="notification-card-actions">
                  {item.read ? (
                    <button
                      title="Mark as unread"
                      onClick={() => markAsUnread(item.id)}
                    >
                      <i className="bi bi-envelope"></i>
                    </button>
                  ) : (
                    <button
                      title="Mark as read"
                      onClick={() => markAsRead(item.id)}
                    >
                      <i className="bi bi-check2"></i>
                    </button>
                  )}

                  <button
                    title="Delete notification"
                    className="notification-delete"
                    onClick={() => deleteNotification(item.id)}
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
