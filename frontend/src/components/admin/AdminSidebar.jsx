import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { path: "/admin/dashboard", icon: "▦", label: "Dashboard" },
    { path: "/admin/students", icon: "♙", label: "Manage Students" },
    { path: "/admin/companies", icon: "▣", label: "Companies" },
    { path: "/admin/jobs", icon: "💼", label: "Manage Jobs" },
    { path: "/admin/applications", icon: "▤", label: "Applications" },
    { path: "/admin/interviews", icon: "▧", label: "Interviews" },
    { path: "/admin/reports", icon: "▥", label: "Reports" },
  ];

  return (
    <>
      <button
        className="admin-mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle admin navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <aside className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">C</div>
          <span>CampusConnect</span>
        </div>

        <div className="admin-sidebar-role">
          <span className="admin-role-dot"></span>
          ADMIN PANEL
        </div>

        <p className="admin-sidebar-heading">MAIN MENU</p>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink to="/admin/announcements" className="admin-sidebar-link">
            <i className="bi bi-megaphone"></i>
            <span>Announcements</span>
          </NavLink>

            <NavLink to="/admin/notifications" className="admin-sidebar-link">
  <i className="bi bi-bell"></i>
  <span>Notifications</span>
</NavLink>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-mini-profile">
            <div className="admin-avatar">AD</div>
            <div>
              <strong>Administrator</strong>
              <small>Super Admin</small>
            </div>
          </div>

          <Link
            to="/login"
            className="admin-sidebar-logout"
            onClick={closeSidebar}
          >
            <span>↪</span> Logout
          </Link>

        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;