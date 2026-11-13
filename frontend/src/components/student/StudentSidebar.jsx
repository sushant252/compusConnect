
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./StudentSidebar.css";

function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

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
          
          <NavLink to="/student/announcements" className="sidebar-link">
            <span><i className="bi bi-megaphone"></i></span>
            Announcements
          </NavLink>
          <NavLink to="/student/notifications" className="sidebar-link">
              <span><i className="bi bi-bell"></i></span>
              Notifications
          </NavLink>

        </nav>

        <div className="sidebar-bottom">
          <div className="student-mini-profile">
            <div className="avatar">RS</div>
            <div>
              <strong>Rahul Sharma</strong>
              <small>Student</small>
            </div>
          </div>

          <Link
            to="/login"
            className="sidebar-logout"
            onClick={closeSidebar}
          >
            ↪ Logout
          </Link>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
