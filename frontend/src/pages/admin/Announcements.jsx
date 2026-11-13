
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./Announcements.css";

const initialAnnouncements = [
  {
    id: 1,
    title: "Registration Open for Campus Placement 2026",
    category: "Placement",
    audience: "All Students",
    date: "14 Nov 2026",
    status: "Published",
    description:
      "Registration is now open for the 2026 campus placement drive. Eligible students are requested to complete their profiles.",
  },
  {
    id: 2,
    title: "Pre-Placement Talk by Tech Solutions",
    category: "Company Visit",
    audience: "Computer Science",
    date: "12 Nov 2026",
    status: "Published",
    description:
      "Tech Solutions will conduct a pre-placement talk for Computer Science students. Please check the placement schedule.",
  },
  {
    id: 3,
    title: "Resume Submission Deadline",
    category: "Important",
    audience: "All Students",
    date: "10 Nov 2026",
    status: "Draft",
    description:
      "Students are requested to upload their latest resumes before the upcoming placement drive.",
  },
  {
    id: 4,
    title: "Interview Preparation Workshop",
    category: "Workshop",
    audience: "All Students",
    date: "08 Nov 2026",
    status: "Published",
    description:
      "A workshop covering technical interviews, aptitude preparation and HR interview skills.",
  },
];

const emptyForm = {
  title: "",
  category: "Placement",
  audience: "All Students",
  description: "",
  status: "Draft",
};

function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [announcements, search, filter]);

  const publishedCount = announcements.filter(
    (item) => item.status === "Published"
  ).length;

  const draftCount = announcements.filter(
    (item) => item.status === "Draft"
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      audience: item.audience,
      description: item.description,
      status: item.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please enter the title and description.");
      return;
    }

    if (editingId) {
      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...form }
            : item
        )
      );
    } else {
      const newAnnouncement = {
        id: Date.now(),
        ...form,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setAnnouncements((previous) => [newAnnouncement, ...previous]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const toggleStatus = (id) => {
    setAnnouncements((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Published" ? "Draft" : "Published",
            }
          : item
      )
    );
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  return (
    <AdminLayout
      title="Announcements"
      subtitle="Create and manage campus announcements"
    >
      <div className="announcements-page">
        <div className="announcement-heading">
          <div>
            <h2>Manage Announcements</h2>
            <p>Share important updates with students.</p>
          </div>

          <button className="announcement-add-btn" onClick={openAddModal}>
            <i className="bi bi-plus-lg"></i> Create Announcement
          </button>
        </div>

        <div className="announcement-stats">
          <div className="announcement-stat-card">
            <div className="announcement-stat-icon blue">
              <i className="bi bi-megaphone"></i>
            </div>
            <div>
              <span>Total Announcements</span>
              <h3>{announcements.length}</h3>
            </div>
          </div>

          <div className="announcement-stat-card">
            <div className="announcement-stat-icon green">
              <i className="bi bi-check-circle"></i>
            </div>
            <div>
              <span>Published</span>
              <h3>{publishedCount}</h3>
            </div>
          </div>

          <div className="announcement-stat-card">
            <div className="announcement-stat-icon orange">
              <i className="bi bi-file-earmark"></i>
            </div>
            <div>
              <span>Drafts</span>
              <h3>{draftCount}</h3>
            </div>
          </div>
        </div>

        <div className="announcement-toolbar">
          <div className="announcement-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="announcement-filter"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="announcement-list">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <div className="announcement-card" key={item.id}>
                <div className="announcement-card-top">
                  <div className="announcement-category">
                    <i className="bi bi-bell"></i>
                    {item.category}
                  </div>

                  <span
                    className={`announcement-status ${
                      item.status === "Published" ? "published" : "draft"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p className="announcement-description">
                  {item.description}
                </p>

                <div className="announcement-meta">
                  <span>
                    <i className="bi bi-people"></i> {item.audience}
                  </span>
                  <span>
                    <i className="bi bi-calendar3"></i> {item.date}
                  </span>
                </div>

                <div className="announcement-actions">
                  <button onClick={() => setViewItem(item)}>
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button onClick={() => openEditModal(item)}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button onClick={() => toggleStatus(item.id)}>
                    <i className="bi bi-arrow-repeat"></i>
                    {item.status === "Published" ? "Move to Draft" : "Publish"}
                  </button>
                  <button
                    className="delete-action"
                    onClick={() => deleteAnnouncement(item.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="announcement-empty">
              <i className="bi bi-megaphone"></i>
              <h3>No announcements found</h3>
              <p>Try changing your search or create a new announcement.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="announcement-modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="announcement-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="announcement-modal-header">
              <div>
                <h3>{editingId ? "Edit Announcement" : "Create Announcement"}</h3>
                <p>Enter the announcement details below.</p>
              </div>
              <button onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Announcement Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter announcement title"
                required
              />

              <div className="announcement-form-row">
                <div>
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>Placement</option>
                    <option>Important</option>
                    <option>Workshop</option>
                    <option>Company Visit</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label>Target Audience</label>
                  <select
                    name="audience"
                    value={form.audience}
                    onChange={handleChange}
                  >
                    <option>All Students</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Electrical</option>
                  </select>
                </div>
              </div>

              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write announcement details..."
                rows="5"
                required
              />

              <label>Publication Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Draft</option>
                <option>Published</option>
              </select>

              <div className="announcement-modal-actions">
                <button
                  type="button"
                  className="announcement-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="announcement-save-btn">
                  {editingId ? "Save Changes" : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewItem && (
        <div
          className="announcement-modal-backdrop"
          onClick={() => setViewItem(null)}
        >
          <div
            className="announcement-modal announcement-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="announcement-modal-header">
              <div>
                <span className="announcement-view-category">
                  {viewItem.category}
                </span>
                <h3>{viewItem.title}</h3>
              </div>
              <button onClick={() => setViewItem(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <p>{viewItem.description}</p>
            <div className="announcement-view-meta">
              <span><strong>Audience:</strong> {viewItem.audience}</span>
              <span><strong>Date:</strong> {viewItem.date}</span>
              <span><strong>Status:</strong> {viewItem.status}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Announcements;
