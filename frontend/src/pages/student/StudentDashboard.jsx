
import { NavLink, Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import "./StudentDashboard.css"
const stats = [
  { title: "Available Jobs", value: "24", icon: "💼", color: "blue" },
  { title: "Applied Jobs", value: "08", icon: "📄", color: "purple" },
  { title: "Shortlisted", value: "03", icon: "⭐", color: "green" },
  { title: "Interviews", value: "02", icon: "📅", color: "orange" },
];

const jobs = [
  {
    company: "Tech Solutions",
    role: "Frontend Developer",
    location: "Noida",
    package: "6 LPA",
    deadline: "25 Nov 2026",
    logo: "T",
  },
  {
    company: "Innovate Labs",
    role: "Software Engineer",
    location: "Bangalore",
    package: "8 LPA",
    deadline: "28 Nov 2026",
    logo: "I",
  },
  {
    company: "Digital Systems",
    role: "React Developer",
    location: "Gurugram",
    package: "5 LPA",
    deadline: "30 Nov 2026",
    logo: "D",
  },
];

function StudentDashboard() {
  return (
     <StudentLayout
    title="Student Dashboard"
    subtitle="Welcome back! Here's your placement overview."
  >
    <div className="student-layout">

    

      {/* Main Content */}
      <main className="student-main">

      

        <div className="dashboard-content">

          {/* Welcome */}
          <section className="welcome-banner">
            <div>
              <span className="welcome-label">STUDENT PORTAL</span>
              <h2>Welcome back, Rahul! 👋</h2>
              <p>
                Keep moving forward. Your dream career starts here.
              </p>
              <Link to="/student/jobs" className="btn btn-light fw-semibold mt-2">
                Explore Jobs →
              </Link>
            </div>

            <div className="welcome-illustration">🎓</div>
          </section>

          {/* Statistics */}
          <section className="mt-4">
            <div className="section-heading">
              <h5>Placement Overview</h5>
              <span>Academic Year 2026–27</span>
            </div>

            <div className="row g-3">
              {stats.map((item) => (
                <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
                  <div className="stat-card">
                    <div className={`stat-icon ${item.color}`}>
                      {item.icon}
                    </div>
                    <p>{item.title}</p>
                    <h3>{item.value}</h3>
                    <small>Current academic year</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Jobs */}
          <section className="mt-4">
            <div className="section-heading">
              <h5>Recommended Jobs</h5>
              <Link to="/student/jobs">View all jobs →</Link>
            </div>

            <div className="row g-3">
              {jobs.map((job) => (
                <div className="col-12 col-lg-4" key={job.company}>
                  <div className="job-card">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="company-logo">{job.logo}</div>
                      <div>
                        <h6 className="mb-1 fw-bold">{job.role}</h6>
                        <small className="text-muted">{job.company}</small>
                      </div>
                    </div>

                    <div className="job-details">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.package}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Deadline: {job.deadline}
                      </small>
                      <Link
                        to="/student/jobs"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="mt-4">
            <div className="section-heading">
              <h5>Recent Application Activity</h5>
              <Link to="/student/applications">View all →</Link>
            </div>

            <div className="activity-card">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Tech Solutions</td>
                      <td>Frontend Developer</td>
                      <td>10 Nov 2026</td>
                      <td>
                        <span className="status-badge shortlisted">
                          Shortlisted
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>Innovate Labs</td>
                      <td>Software Engineer</td>
                      <td>08 Nov 2026</td>
                      <td>
                        <span className="status-badge pending">
                          Pending
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>Digital Systems</td>
                      <td>React Developer</td>
                      <td>05 Nov 2026</td>
                      <td>
                        <span className="status-badge rejected">
                          Rejected
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <footer className="dashboard-footer">
            © 2026 CampusConnect. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
     </StudentLayout>
  );
}

export default StudentDashboard;
