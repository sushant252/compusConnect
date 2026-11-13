
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
// student
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseJobs from "./pages/student/BrowseJobs";
import MyApplications from "./pages/student/MyApplications";
import Interviews from "./pages/student/Interviews";
import MyProfile from "./pages/student/MyProfile";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentNotifications from "./pages/student/StudentNotifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/jobs" element={<BrowseJobs />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/student/interviews" element={<Interviews />} />
        <Route path="/student/profile" element={<MyProfile />} />
        <Route path="/student/announcements" element={<StudentAnnouncements />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        {/* Admin Route */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/companies" element={<ManageCompanies />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/applications" element={<ManageApplications />} />
        <Route path="/admin/interviews" element={<ManageInterviews />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/notifications" element={<ManageNotifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
