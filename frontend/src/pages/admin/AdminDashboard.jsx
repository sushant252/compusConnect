import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import "./AdminDashboard.css";

const stats = [
  { title: "Total Students", value: "1,250", icon: "👨‍🎓", color: "blue" },
  { title: "Registered Companies", value: "48", icon: "🏢", color: "purple" },
  { title: "Active Jobs", value: "32", icon: "💼", color: "green" },
  { title: "Total Applications", value: "856", icon: "📄", color: "orange" },
];

const activities = [
  { name: "Rahul Sharma", action: "Applied for Frontend Developer", date: "14 Nov 2026", status: "Pending" },
  { name: "Priya Verma", action: "Got shortlisted at Tech Solutions", date: "13 Nov 2026", status: "Shortlisted" },
  { name: "Aman Gupta", action: "Registered on CampusConnect", date: "12 Nov 2026", status: "New Student" },
  { name: "Sneha Singh", action: "Applied for Software Engineer", date: "11 Nov 2026", status: "Pending" },
];

function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome to your placement management dashboard"
    >
      <div className="admin-dashboard">
        <div className="admin-welcome">
          <div>
            <span className="admin-welcome-label">ADMIN OVERVIEW</span>
            <h2>Welcome back, Admin! 👋</h2>
            <p>Here's what's happening with campus placements today.</p>
          </div>
          <div className="admin-welcome-icon">📊</div>
        </div>

        <div className="admin-stats-grid">
          {stats.map((item) => (
            <div className="admin-stat-card" key={item.title}>
              <div className={`admin-stat-icon ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p>{item.title}</p>
                <h3>{item.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-dashboard-grid">
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h5>Recent Activities</h5>
                <p>Latest placement updates</p>
              </div>
              <span className="admin-live-label">Demo Overview</span>
            </div>

            <div className="admin-table-wrapper">
              <table className="table admin-activity-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td><strong>{activity.name}</strong></td>
                      <td>{activity.action}</td>
                      <td>{activity.date}</td>
                      <td>
                        <span className={`admin-status ${activity.status.toLowerCase().replace(" ", "-")}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel admin-quick-panel">
            <div className="admin-panel-heading">
              <div>
                <h5>Quick Actions</h5>
                <p>Manage your placement portal</p>
              </div>
            </div>

            <div className="admin-quick-actions">
              <Link to="/admin/students" className="admin-action-link">
                <span>👨‍🎓</span>
                <div>
                  <strong>Manage Students</strong>
                  <small>View and manage student records</small>
                </div>
                <b>›</b>
              </Link>

              <Link to="/admin/companies" className="admin-action-link">
                <span>🏢</span>
                <div>
                  <strong>Manage Companies</strong>
                  <small>Add or update company details</small>
                </div>
                <b>›</b>
              </Link>

              <Link to="/admin/jobs" className="admin-action-link">
                <span>💼</span>
                <div>
                  <strong>Manage Jobs</strong>
                  <small>Create and manage job openings</small>
                </div>
                <b>›</b>
              </Link>

              <Link to="/admin/applications" className="admin-action-link">
                <span>📋</span>
                <div>
                  <strong>Applications</strong>
                  <small>Review student applications</small>
                </div>
                <b>›</b>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;