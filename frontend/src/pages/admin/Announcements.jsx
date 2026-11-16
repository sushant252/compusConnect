
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./Announcements.css";

const emptyForm = {
  title: "",
  category: "Placement",
  audience: "All Students",
  description: "",
  status: "Draft",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeAnnouncement = (announcement) => ({
  ...announcement,
  id: announcement._id,
  description: announcement.message,
  category: announcement.category || "General",
  audience: "All Students",
  date: formatDate(announcement.createdAt),
  status: announcement.isActive ? "Published" : "Draft",
});

const getBackendCategory = (category) => {
  if (category === "Workshop" || category === "Company Visit") {
    return "Event";
  }

  return category;
};

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/announcements");

      const data = response.data.announcements || [];

      setAnnouncements(data.map(normalizeAnnouncement));
    } catch (err) {
      console.error("Fetch announcements error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load announcements. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || item.status === filter;

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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please enter the title and description.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      message: form.description.trim(),
      category: getBackendCategory(form.category),
      priority: form.category === "Important" ? "High" : "Medium",
      isActive: form.status === "Published",
    };

    try {
      setSaving(true);

      if (editingId) {
        await API.put(`/announcements/${editingId}`, payload);
        alert("Announcement updated successfully!");
      } else {
        await API.post("/announcements", payload);
        alert("Announcement created successfully!");
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);

      await fetchAnnouncements();
    } catch (err) {
      console.error("Save announcement error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to save announcement. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    const item = announcements.find(
      (announcement) => announcement.id === id
    );

    if (!item) return;

    const newStatus = item.status === "Published" ? false : true;

    try {
      await API.put(`/announcements/${id}`, {
        isActive: newStatus,
      });

      await fetchAnnouncements();
    } catch (err) {
      console.error("Toggle announcement status error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update announcement status."
      );
    }
  };

  const deleteAnnouncement = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this announcement?"
      )
    ) {
      try {
        await API.delete(`/announcements/${id}`);

        if (viewItem?.id === id) {
          setViewItem(null);
        }

        await fetchAnnouncements();
      } catch (err) {
        console.error("Delete announcement error:", err);

        alert(
          err.response?.data?.message ||
            "Failed to delete announcement."
        );
      }
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

          <button
            className="announcement-add-btn"
            onClick={openAddModal}
          >
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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchAnnouncements}
            >
              Retry
            </button>
          </div>
        )}

        <div className="announcement-list">
          {loading ? (
            <div className="announcement-empty">
              <p>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <div className="announcement-card" key={item.id}>
                <div className="announcement-card-top">
                  <div className="announcement-category">
                    <i className="bi bi-bell"></i>
                    {item.category}
                  </div>

                  <span
                    className={`announcement-status ${
                      item.status === "Published"
                        ? "published"
                        : "draft"
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
                    {item.status === "Published"
                      ? "Move to Draft"
                      : "Publish"}
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
              <p>
                Try changing your search or create a new announcement.
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="announcement-modal-backdrop"
          onClick={() => !saving && setShowModal(false)}
        >
          <div
            className="announcement-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="announcement-modal-header">
              <div>
                <h3>
                  {editingId
                    ? "Edit Announcement"
                    : "Create Announcement"}
                </h3>
                <p>Enter the announcement details below.</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
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
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="announcement-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Announcement"}
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
              <span>
                <strong>Audience:</strong> {viewItem.audience}
              </span>

              <span>
                <strong>Date:</strong> {viewItem.date}
              </span>

              <span>
                <strong>Status:</strong> {viewItem.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Announcements;
