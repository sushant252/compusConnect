
import { useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "./MyApplications.css";

const applicationsData = [
  {
    id: 1,
    company: "Tech Solutions",
    role: "Frontend Developer",
    location: "Noida",
    package: "6 LPA",
    appliedDate: "10 Nov 2026",
    status: "Shortlisted",
    logo: "T",
    color: "blue",
  },
  {
    id: 2,
    company: "Innovate Labs",
    role: "Software Engineer",
    location: "Bangalore",
    package: "8 LPA",
    appliedDate: "12 Nov 2026",
    status: "Pending",
    logo: "I",
    color: "purple",
  },
  {
    id: 3,
    company: "Digital Systems",
    role: "React Developer",
    location: "Gurugram",
    package: "5 LPA",
    appliedDate: "08 Nov 2026",
    status: "Rejected",
    logo: "D",
    color: "orange",
  },
  {
    id: 4,
    company: "CloudTech",
    role: "Backend Developer",
    location: "Pune",
    package: "7 LPA",
    appliedDate: "14 Nov 2026",
    status: "Pending",
    logo: "C",
    color: "green",
  },
  {
    id: 5,
    company: "DataSphere",
    role: "Data Analyst",
    location: "Delhi",
    package: "4.5 LPA",
    appliedDate: "15 Nov 2026",
    status: "Shortlisted",
    logo: "D",
    color: "pink",
  },
];

function MyApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Pending", "Shortlisted", "Rejected"];

  const filteredApplications = useMemo(() => {
    return applicationsData.filter((application) => {
      const matchesSearch =
        application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" || application.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const totalApplications = applicationsData.length;
  const shortlisted = applicationsData.filter(
    (app) => app.status === "Shortlisted"
  ).length;
  const pending = applicationsData.filter(
    (app) => app.status === "Pending"
  ).length;
  const rejected = applicationsData.filter(
    (app) => app.status === "Rejected"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: totalApplications,
      icon: "▤",
      color: "stat-blue",
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      icon: "✓",
      color: "stat-green",
    },
    {
      label: "Pending",
      value: pending,
      icon: "◷",
      color: "stat-orange",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "✕",
      color: "stat-red",
    },
  ];

  return (
    <StudentLayout
      title="My Applications"
      subtitle="Track and manage your job applications"
     
    >
       <div className="student-layout">
        <main className="student-main">
         

      {/* Statistics */}
      <div className="application-stats">
        {stats.map((stat) => (
          <div className="application-stat-card" key={stat.label}>
            <div className={`application-stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <h3>{stat.value.toString().padStart(2, "0")}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="applications-toolbar">
        <div className="application-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search company or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="application-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`application-filter-btn ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-list">
        <div className="applications-list-heading">
          <div>
            <h3>Recent Applications</h3>
            <p>
              Showing {filteredApplications.length} of {totalApplications} applications
            </p>
          </div>
        </div>

        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div className="application-card" key={application.id}>
              <div className={`application-company-logo ${application.color}`}>
                {application.logo}
              </div>

              <div className="application-main-info">
                <h4>{application.role}</h4>
                <p className="application-company">
                  {application.company}
                </p>

                <div className="application-meta">
                  <span>⌖ {application.location}</span>
                  <span>₹ {application.package}</span>
                  <span>Applied: {application.appliedDate}</span>
                </div>
              </div>

              <div className="application-card-right">
                <span
                  className={`application-status ${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>
                <small>Application #{application.id}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="applications-empty">
            <div>⌕</div>
            <h4>No applications found</h4>
            <p>Try changing your search or selecting another status.</p>
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

export default MyApplications;
