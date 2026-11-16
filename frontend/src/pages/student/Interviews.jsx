
import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./Interviews.css";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/interviews/my");
      setInterviews(response.data.interviews || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (status) => {
    if (status === "Scheduled") return "Upcoming";
    return status;
  };

  const getCompanyName = (interview) => {
    return interview.job?.company?.name || "Company";
  };

  const getJobTitle = (interview) => {
    return interview.job?.title || "Job Role";
  };

  const getCompanyLogo = (interview) => {
    return getCompanyName(interview).charAt(0).toUpperCase();
  };

  const getCompanyColor = (interview) => {
    const colors = ["blue", "purple", "green", "orange"];
    const value = getCompanyName(interview).length;
    return colors[value % colors.length];
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filters = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const company = getCompanyName(interview).toLowerCase();
      const role = getJobTitle(interview).toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        company.includes(search) || role.includes(search);

      const matchesFilter =
        activeFilter === "All" ||
        getDisplayStatus(interview.status) === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [interviews, activeFilter, searchTerm]);

  const stats = [
    {
      label: "Total Interviews",
      value: interviews.length,
      icon: "▣",
      color: "interview-blue",
    },
    {
      label: "Upcoming",
      value: interviews.filter(
        (item) => item.status === "Scheduled"
      ).length,
      icon: "◷",
      color: "interview-orange",
    },
    {
      label: "Completed",
      value: interviews.filter(
        (item) => item.status === "Completed"
      ).length,
      icon: "✓",
      color: "interview-green",
    },
    {
      label: "Cancelled",
      value: interviews.filter(
        (item) => item.status === "Cancelled"
      ).length,
      icon: "✕",
      color: "interview-red",
    },
  ];

  return (
    <StudentLayout
      title="Interviews"
      subtitle="Manage your placement interviews"
    >
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
                  Showing {filteredInterviews.length} of {interviews.length} interviews
                </p>
              </div>
            </div>

            {loading ? (
              <div className="interviews-empty">
                <h4>Loading interviews...</h4>
              </div>
            ) : error ? (
              <div className="interviews-empty">
                <h4>Unable to load interviews</h4>
                <p>{error}</p>
                <button onClick={fetchInterviews}>Try Again</button>
              </div>
            ) : filteredInterviews.length > 0 ? (
              filteredInterviews.map((interview) => {
                const displayStatus = getDisplayStatus(interview.status);

                return (
                  <div className="interview-card" key={interview._id}>
                    <div
                      className={`interview-company-logo ${getCompanyColor(
                        interview
                      )}`}
                    >
                      {getCompanyLogo(interview)}
                    </div>

                    <div className="interview-main-info">
                      <h4>{getJobTitle(interview)}</h4>
                      <p className="interview-company">
                        {getCompanyName(interview)}
                      </p>

                      <div className="interview-meta">
                        <span>▣ {formatDate(interview.interviewDate)}</span>
                        <span>◷ {interview.interviewTime}</span>
                        <span>
                          ⌖ {interview.mode === "Offline" ? "On Campus" : "Online"}
                        </span>
                      </div>

                      <span className="interview-round">
                        {interview.round || "Technical Round"}
                      </span>
                    </div>

                    <div className="interview-card-right">
                      <span
                        className={`interview-status ${displayStatus.toLowerCase()}`}
                      >
                        {displayStatus}
                      </span>

                      {displayStatus === "Upcoming" &&
                        interview.mode === "Online" &&
                        interview.meetingLink && (
                          <button
                            className="interview-join-btn"
                            onClick={() =>
                              window.open(
                                interview.meetingLink,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            Meeting Details
                          </button>
                        )}

                      {displayStatus === "Upcoming" &&
                        interview.mode === "Online" &&
                        !interview.meetingLink && (
                          <button
                            className="interview-join-btn"
                            disabled
                          >
                            Link Not Available
                          </button>
                        )}

                      <small>
                        Interview #{interview._id.slice(-6).toUpperCase()}
                      </small>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="interviews-empty">
                <div>▣</div>
                <h4>No interviews found</h4>
                <p>
                  Try another search term or status filter.
                </p>
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
