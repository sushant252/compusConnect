
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./StudentNavbar.css";

function StudentNavbar({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="student-topbar">

      <div className="navbar-page-info">
        <h5>{title}</h5>
        <small>{subtitle}</small>
      </div>

      <div className="topbar-right">
       <div className="student-user-info">
          <span>{user?.name || "Student"}</span>
        </div>
        <div className="navbar-notification-wrapper" ref={notificationRef}>
          <button
            className="notification-btn"
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
          >
            <span className="notification-icon">♧</span>
            <span className="notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-dropdown-header">
                <strong>Notifications</strong>
                <span>2 New</span>
              </div>

              <div className="notification-list">

                <div className="notification-item">
                  <div className="notification-item-icon blue">💼</div>
                  <div>
                    <strong>New Job Posted</strong>
                    <p>A new Frontend Developer job is available.</p>
                    <small>10 minutes ago</small>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-item-icon green">📅</div>
                  <div>
                    <strong>Interview Scheduled</strong>
                    <p>Your interview schedule has been updated.</p>
                    <small>1 hour ago</small>
                  </div>
                </div>

              </div>

              <Link
                to="/student/applications"
                className="notification-footer"
                onClick={() => setShowNotifications(false)}
              >
                View all notifications →
              </Link>

            </div>
          )}
        </div>

        

       

      </div>
    </header>
  );
}

export default StudentNavbar;
