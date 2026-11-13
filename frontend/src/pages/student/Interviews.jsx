
import { useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "./Interviews.css";

const interviewsData = [
  {
    id: 1,
    company: "Tech Solutions",
    role: "Frontend Developer",
    date: "18 Nov 2026",
    time: "10:30 AM",
    mode: "Online",
    round: "Technical Round",
    status: "Upcoming",
    logo: "T",
    color: "blue",
  },
  {
    id: 2,
    company: "Innovate Labs",
    role: "Software Engineer",
    date: "20 Nov 2026",
    time: "02:00 PM",
    mode: "Online",
    round: "HR Round",
    status: "Upcoming",
    logo: "I",
    color: "purple",
  },
  {
    id: 3,
    company: "CloudTech",
    role: "Backend Developer",
    date: "10 Nov 2026",
    time: "11:00 AM",
    mode: "On Campus",
    round: "Technical Round",
    status: "Completed",
    logo: "C",
    color: "green",
  },
  {
    id: 4,
    company: "Digital Systems",
    role: "React Developer",
    date: "05 Nov 2026",
    time: "12:00 PM",
    mode: "Online",
    round: "HR Round",
    status: "Cancelled",
    logo: "D",
    color: "orange",
  },
];

function Interviews() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredInterviews = useMemo(() => {
    return interviewsData.filter((interview) => {
      const matchesSearch =
        interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || interview.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchTerm]);

  const stats = [
    {
      label: "Total Interviews",
      value: interviewsData.length,
      icon: "▣",
      color: "interview-blue",
    },
    {
      label: "Upcoming",
      value: interviewsData.filter((item) => item.status === "Upcoming").length,
      icon: "◷",
      color: "interview-orange",
    },
    {
      label: "Completed",
      value: interviewsData.filter((item) => item.status === "Completed").length,
      icon: "✓",
      color: "interview-green",
    },
    {
      label: "Cancelled",
      value: interviewsData.filter((item) => item.status === "Cancelled").length,
      icon: "✕",
      color: "interview-red",
    },
  ];

  return (
    <StudentLayout title="Interviews" subtitle="Manage your placement interviews" >
     <div className="student-layout">
       <main className="student-main">
        
      {/* Statistics */}
      <div className="interview-stats">
        {stats.map((stat) => (
          <div className="interview-stat-card" key={stat.label}>
            <div className={`interview-stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <h3>{String(stat.value).padStart(2, "0")}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="interviews-toolbar">
        <div className="interview-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search company or job role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="interview-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`interview-filter-btn ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Interview List */}
      <div className="interviews-list">
        <div className="interviews-list-heading">
          <div>
            <h3>Interview Schedule</h3>
            <p>
              Showing {filteredInterviews.length} of {interviewsData.length} interviews
            </p>
          </div>
        </div>

        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <div className="interview-card" key={interview.id}>
              <div className={`interview-company-logo ${interview.color}`}>
                {interview.logo}
              </div>

              <div className="interview-main-info">
                <h4>{interview.role}</h4>
                <p className="interview-company">{interview.company}</p>

                <div className="interview-meta">
                  <span>▣ {interview.date}</span>
                  <span>◷ {interview.time}</span>
                  <span>⌖ {interview.mode}</span>
                </div>

                <span className="interview-round">
                  {interview.round}
                </span>
              </div>

              <div className="interview-card-right">
                <span
                  className={`interview-status ${interview.status.toLowerCase()}`}
                >
                  {interview.status}
                </span>

                {interview.status === "Upcoming" && interview.mode === "Online" && (
                  <button
                    className="interview-join-btn"
                    onClick={() =>
                      alert("Meeting link will be available when the interview is scheduled.")
                    }
                  >
                    Meeting Details
                  </button>
                )}

                <small>Interview #{interview.id}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="interviews-empty">
            <div>▣</div>
            <h4>No interviews found</h4>
            <p>Try another search term or status filter.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
       </main>
     </div>
    </StudentLayout>

    
  );
}

export default Interviews;
