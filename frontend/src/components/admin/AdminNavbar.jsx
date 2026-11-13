import { useState, useEffect, useRef } from "react";
import "./AdminNavbar.css";

function AdminNavbar({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="admin-topbar">
      <div className="admin-navbar-page-info">
        <h5>{title}</h5>
        <p>{subtitle}</p>
      </div>

      <div className="admin-navbar-actions">
        <div className="admin-search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
        </div>

        <div className="admin-notification-wrapper" ref={notificationRef}>
          <button
            className="admin-notification-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            ♧
            <span className="admin-notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="admin-notification-dropdown">
              <div className="admin-notification-header">
                <strong>Notifications</strong>
                <span>2 New</span>
              </div>

              <div className="admin-notification-item">
                <div className="admin-notification-icon">👨‍🎓</div>
                <div>
                  <strong>New Student Registered</strong>
                  <p>A new student joined CampusConnect.</p>
                  <small>10 minutes ago</small>
                </div>
              </div>

              <div className="admin-notification-item">
                <div className="admin-notification-icon">💼</div>
                <div>
                  <strong>New Job Application</strong>
                  <p>A student applied for a job opening.</p>
                  <small>30 minutes ago</small>
                </div>
              </div>

              <div className="admin-notification-footer">
                All notifications are demo data
              </div>
            </div>
          )}
        </div>

        <div className="admin-navbar-profile">
          <div className="admin-navbar-avatar">AD</div>
          <div className="admin-navbar-profile-info">
            <strong>Administrator</strong>
            <small>Super Admin</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;