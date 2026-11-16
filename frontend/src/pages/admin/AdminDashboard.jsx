
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Total Students", value: 0, icon: "👨‍🎓", color: "blue" },
    { title: "Registered Companies", value: 0, icon: "🏢", color: "purple" },
    { title: "Active Jobs", value: 0, icon: "💼", color: "green" },
    { title: "Total Applications", value: 0, icon: "📄", color: "orange" },
  ]);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/admin/dashboard");

        const dashboardData = response.data;

        setStats([
          {
            title: "Total Students",
            value: dashboardData.stats.totalStudents,
            icon: "👨‍🎓",
            color: "blue",
          },
          {
            title: "Registered Companies",
            value: dashboardData.stats.totalCompanies,
            icon: "🏢",
            color: "purple",
          },
          {
            title: "Active Jobs",
            value: dashboardData.stats.activeJobs,
            icon: "💼",
            color: "green",
          },
          {
            title: "Total Applications",
            value: dashboardData.stats.totalApplications,
            icon: "📄",
            color: "orange",
          },
        ]);

        setActivities(dashboardData.recentActivities || []);

      } catch (err) {
        console.error("Dashboard fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome to your placement management dashboard"
    >
      <div className="admin-dashboard">

        <div className="admin-welcome">
          <div>
            <span className="admin-welcome-label">
              ADMIN OVERVIEW
            </span>

            <h2>Welcome back, Admin! 👋</h2>

            <p>
              Here's what's happening with campus placements today.
            </p>
          </div>

          <div className="admin-welcome-icon">📊</div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="admin-stats-grid">
          {stats.map((item) => (
            <div className="admin-stat-card" key={item.title}>
              <div className={`admin-stat-icon ${item.color}`}>
                {item.icon}
              </div>

              <div>
                <p>{item.title}</p>
                <h3>{loading ? "..." : item.value}</h3>
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

              <span className="admin-live-label">
                Live Data
              </span>
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
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        Loading activities...
                      </td>
                    </tr>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          <strong>{activity.name}</strong>
                        </td>

                        <td>{activity.action}</td>

                        <td>{formatDate(activity.date)}</td>

                        <td>
                          <span
                            className={`admin-status ${activity.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No recent activities found.
                      </td>
                    </tr>
                  )}
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
