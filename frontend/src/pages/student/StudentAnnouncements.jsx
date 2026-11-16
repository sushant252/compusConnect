
import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./StudentAnnouncements.css";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/announcements");

        setAnnouncements(response.data.announcements || []);
      } catch (err) {
        console.error("Fetch announcements error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load announcements."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const normalizedAnnouncements = useMemo(() => {
    return announcements.map((item) => ({
      ...item,
      category: item.category || "General",
      description: item.message || "",
      date: formatDate(item.createdAt),
      audience: "All Students",
      postedBy: item.createdBy?.name || "Placement Cell",
      important: item.priority === "High",
      priority: item.priority || "Medium",
    }));
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return normalizedAnnouncements.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [normalizedAnnouncements, search, category]);

  const categories = [
    "All",
    ...new Set(
      normalizedAnnouncements
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  return (
    <StudentLayout
      title="Announcements"
      subtitle="Stay updated with the latest campus news"
      contentClassName="student-announcements-page"
    >
      <div className="student-layout">
        <main className="student-main">
          <div className="student-announcements-page">

            {/* Welcome Banner */}
            <div className="student-announcement-welcome">
              <div>
                <span className="student-announcement-eyebrow">
                  CAMPUS CONNECT UPDATES
                </span>

                <h2>What's happening on campus?</h2>

                <p>
                  Important updates, placement notices and events from your
                  college placement cell.
                </p>
              </div>

              <div className="student-announcement-welcome-icon">
                <i className="bi bi-megaphone-fill"></i>
              </div>
            </div>

            {/* Summary */}
            <div className="student-announcement-summary">
              <div className="student-announcement-summary-icon">
                <i className="bi bi-bell-fill"></i>
              </div>

              <div>
                <span>Available announcements</span>
                <h3>{loading ? "..." : announcements.length}</h3>
              </div>
            </div>

            {/* Section Heading */}
            <div className="student-announcement-section-heading">
              <div>
                <h3>Latest Announcements</h3>
                <p>Explore updates shared by your placement cell.</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="student-announcement-toolbar">
              <div className="student-announcement-search">
                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="student-announcement-filter"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Announcement List */}
            <div className="student-announcement-list">

              {loading && (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>

                  <p className="text-muted mt-2">
                    Loading announcements...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {!loading && !error && filteredAnnouncements.length > 0 && (
                filteredAnnouncements.map((item) => (
                  <article
                    className="student-announcement-card"
                    key={item._id}
                  >
                    <div className="student-announcement-card-icon">
                      <i
                        className={
                          item.category === "Placement"
                            ? "bi bi-briefcase-fill"
                            : item.category === "Event"
                            ? "bi bi-calendar-event-fill"
                            : item.category === "Important"
                            ? "bi bi-exclamation-circle-fill"
                            : "bi bi-megaphone-fill"
                        }
                      ></i>
                    </div>

                    <div className="student-announcement-card-content">

                      <div className="student-announcement-card-meta">
                        <span className="student-announcement-category">
                          Category: {item.category}
                        </span>

                        {item.important && (
                          <span className="student-announcement-important">
                            <i className="bi bi-star-fill"></i> Important
                          </span>
                        )}
                      </div>

                      <h4>{item.title}</h4>

                      <p>{item.description}</p>

                      <div className="student-announcement-card-footer">
                        <div>
                          <span>
                            <i className="bi bi-calendar3"></i> {item.date}
                          </span>

                          <span>
                            <i className="bi bi-person"></i> {item.postedBy}
                          </span>

                          <span>
                            <i className="bi bi-people"></i> {item.audience}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedAnnouncement(item)}
                        >
                          Read More <i className="bi bi-arrow-right"></i>
                        </button>
                      </div>

                    </div>
                  </article>
                ))
              )}

              {!loading && !error && filteredAnnouncements.length === 0 && (
                <div className="student-announcement-empty">
                  <i className="bi bi-inbox"></i>

                  <h3>No announcements found</h3>

                  <p>
                    Try another search term or select a different category.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Read More Modal */}
          {selectedAnnouncement && (
            <div
              className="student-announcement-modal-backdrop"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <div
                className="student-announcement-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="student-announcement-modal-header">
                  <span className="student-announcement-category">
                    Category: {selectedAnnouncement.category || "General"}
                  </span>

                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <h3>{selectedAnnouncement.title}</h3>

                <div className="student-announcement-modal-meta">
                  <span>
                    <i className="bi bi-calendar3"></i>{" "}
                    {selectedAnnouncement.date}
                  </span>

                  <span>
                    <i className="bi bi-person"></i>{" "}
                    {selectedAnnouncement.postedBy}
                  </span>

                  <span>
                    <i className="bi bi-people"></i>{" "}
                    {selectedAnnouncement.audience}
                  </span>
                </div>

                <p>{selectedAnnouncement.description}</p>

                <div className="mt-3">
                  <strong>Priority:</strong>{" "}
                  {selectedAnnouncement.priority}
                </div>

                {selectedAnnouncement.expiryDate && (
                  <div className="mt-2">
                    <strong>Valid Until:</strong>{" "}
                    {formatDate(selectedAnnouncement.expiryDate)}
                  </div>
                )}

                <button
                  className="student-announcement-close-btn"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </StudentLayout>
  );
}

export default StudentAnnouncements;
