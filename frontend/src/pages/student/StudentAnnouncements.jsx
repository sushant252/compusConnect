
import { useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "./StudentAnnouncements.css";

const announcementsData = [
  {
    id: 1,
    title: "Registration Open for Campus Placement 2026",
    category: "Placement",
    date: "14 Nov 2026",
    audience: "All Students",
    description:
      "Registration is now open for the 2026 campus placement drive. All eligible students are requested to complete their profiles and verify their academic details before applying.",
    important: true,
  },
  {
    id: 2,
    title: "Pre-Placement Talk by Tech Solutions",
    category: "Company Visit",
    date: "12 Nov 2026",
    audience: "Computer Science",
    description:
      "Tech Solutions will conduct a pre-placement talk for Computer Science students. The session will cover company details, job roles, eligibility criteria and the selection process.",
    important: false,
  },
  {
    id: 3,
    title: "Resume Submission Deadline",
    category: "Important",
    date: "10 Nov 2026",
    audience: "All Students",
    description:
      "Students are requested to upload their latest resumes in PDF format before the upcoming placement drive. Please ensure that your contact and academic information is up to date.",
    important: true,
  },
  {
    id: 4,
    title: "Interview Preparation Workshop",
    category: "Workshop",
    date: "08 Nov 2026",
    audience: "All Students",
    description:
      "The placement cell is organizing an interview preparation workshop covering technical interviews, aptitude preparation, communication skills and HR interview techniques.",
    important: false,
  },
  {
    id: 5,
    title: "Placement Orientation Session",
    category: "General",
    date: "06 Nov 2026",
    audience: "All Students",
    description:
      "All students are invited to attend the placement orientation session to understand placement rules, registration steps and the recruitment process.",
    important: false,
  },
];

function StudentAnnouncements() {
  const [announcements] = useState(announcementsData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [announcements, search, category]);

  const categories = [
    "All",
    "Placement",
    "Important",
    "Workshop",
    "Company Visit",
    "General",
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

        <div className="student-announcement-summary">
          <div className="student-announcement-summary-icon">
            <i className="bi bi-bell-fill"></i>
          </div>
          <div>
            <span>Available announcements</span>
            <h3>{announcements.length}</h3>
          </div>
        </div>

        <div className="student-announcement-section-heading">
          <div>
            <h3>Latest Announcements</h3>
            <p>Explore updates shared by your placement cell.</p>
          </div>
        </div>

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

        <div className="student-announcement-list">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <article className="student-announcement-card" key={item.id}>
                <div className="student-announcement-card-icon">
                  <i
                    className={
                      item.category === "Placement"
                        ? "bi bi-briefcase-fill"
                        : item.category === "Workshop"
                        ? "bi bi-easel-fill"
                        : item.category === "Company Visit"
                        ? "bi bi-building"
                        : item.category === "Important"
                        ? "bi bi-exclamation-circle-fill"
                        : "bi bi-megaphone-fill"
                    }
                  ></i>
                </div>

                <div className="student-announcement-card-content">
                  <div className="student-announcement-card-meta">
                    <span className="student-announcement-category">
                      {item.category}
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
          ) : (
            <div className="student-announcement-empty">
              <i className="bi bi-inbox"></i>
              <h3>No announcements found</h3>
              <p>Try another search term or select a different category.</p>
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
                {selectedAnnouncement.category}
              </span>
              <button onClick={() => setSelectedAnnouncement(null)}>
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
                <i className="bi bi-people"></i>{" "}
                {selectedAnnouncement.audience}
              </span>
            </div>

            <p>{selectedAnnouncement.description}</p>

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
