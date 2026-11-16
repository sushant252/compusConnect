
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCompanies from "./pages/admin/ManageCompanies";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageApplications from "./pages/admin/ManageApplications";
import ManageInterviews from "./pages/admin/ManageInterviews";
import Reports from "./pages/admin/Reports";
import Announcements from "./pages/admin/Announcements";
import ManageNotifications from "./pages/admin/ManageNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseJobs from "./pages/student/BrowseJobs";
import MyApplications from "./pages/student/MyApplications";
import Interviews from "./pages/student/Interviews";
import MyProfile from "./pages/student/MyProfile";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentNotifications from "./pages/student/StudentNotifications";

// Protect routes according to user role
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin/dashboard"
            : "/student/dashboard"
        }
        replace
      />
    );
  }

  return children;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        
        <Route
  path="/"
  element={<Navigate to="/login" replace />}
/>

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : "/student/dashboard"
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/login" replace /> : <Register />}
        />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/jobs" element={<ProtectedRoute role="student"><BrowseJobs /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />
        <Route path="/student/interviews" element={<ProtectedRoute role="student"><Interviews /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><MyProfile /></ProtectedRoute>} />
        <Route path="/student/announcements" element={<ProtectedRoute role="student"><StudentAnnouncements /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><ManageStudents /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute role="admin"><ManageCompanies /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><ManageJobs /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute role="admin"><ManageApplications /></ProtectedRoute>} />
        <Route path="/admin/interviews" element={<ProtectedRoute role="admin"><ManageInterviews /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><Announcements /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><ManageNotifications /></ProtectedRoute>} />
          <Route
    path="/admin/settings"
    element={
        <ProtectedRoute role="admin">
            <AdminSettings />
        </ProtectedRoute>
    }
/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
