
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./StudentSidebar.css";

function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`student-sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">C</div>
          <span>CampusConnect</span>
        </div>

        <p className="sidebar-heading">MENU</p>

        <nav className="sidebar-nav">
          <NavLink
            to="/student/dashboard"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span>▦</span> Dashboard
          </NavLink>

          <NavLink
            to="/student/jobs"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span>⌕</span> Browse Jobs
          </NavLink>

          <NavLink
            to="/student/applications"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span>▤</span> My Applications
          </NavLink>

          <NavLink
            to="/student/interviews"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span>▣</span> Interviews
          </NavLink>

          <NavLink
            to="/student/profile"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span>♙</span> My Profile
          </NavLink>

          <NavLink
            to="/student/announcements"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span><i className="bi bi-megaphone"></i></span>
            Announcements
          </NavLink>

          <NavLink
            to="/student/notifications"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <span><i className="bi bi-bell"></i></span>
            Notifications
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="student-mini-profile">
            <div className="avatar">
              {user?.name
                ? user.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()
                : "ST"}
            </div>

            <div>
              <strong>{user?.name || "Student"}</strong>
              <small>Student</small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
