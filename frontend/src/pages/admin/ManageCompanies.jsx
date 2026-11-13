
import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./ManageCompanies.css";

const initialCompanies = [
  {
    id: 1,
    name: "Tech Solutions",
    email: "hr@techsolutions.com",
    industry: "IT Services",
    location: "Noida",
    website: "www.techsolutions.com",
    jobs: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "Innovate Labs",
    email: "careers@innovatelabs.com",
    industry: "Software",
    location: "Bangalore",
    website: "www.innovatelabs.com",
    jobs: 3,
    status: "Active",
  },
  {
    id: 3,
    name: "Digital Systems",
    email: "hr@digitalsystems.com",
    industry: "IT Services",
    location: "Gurugram",
    website: "www.digitalsystems.com",
    jobs: 2,
    status: "Pending",
  },
  {
    id: 4,
    name: "CloudTech",
    email: "jobs@cloudtech.com",
    industry: "Cloud Computing",
    location: "Pune",
    website: "www.cloudtech.com",
    jobs: 4,
    status: "Active",
  },
];

function ManageCompanies() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    location: "",
    website: "",
  });

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const query = search.toLowerCase();

      const matchesSearch =
        company.name.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || company.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, search, statusFilter]);

  const handleAddCompany = (e) => {
    e.preventDefault();

    const newCompany = {
      id: Date.now(),
      ...form,
      jobs: 0,
      status: "Pending",
    };

    setCompanies((prev) => [newCompany, ...prev]);
    setForm({
      name: "",
      email: "",
      industry: "",
      location: "",
      website: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies((prev) => prev.filter((company) => company.id !== id));
      if (selectedCompany?.id === id) setSelectedCompany(null);
    }
  };

  return (
    <AdminLayout
      title="Manage Companies"
      subtitle="Manage registered recruiting companies"
    >
      <div className="manage-companies-page">
        <div className="companies-heading">
          <div>
            <h2>Company Management</h2>
            <p>Manage companies participating in campus placements.</p>
          </div>
          <button
            className="company-add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Company
          </button>
        </div>

        <div className="companies-stats">
          <div className="company-stat-card">
            <span>🏢</span>
            <div>
              <p>Total Companies</p>
              <h3>{companies.length}</h3>
            </div>
          </div>
          <div className="company-stat-card">
            <span>✅</span>
            <div>
              <p>Active Companies</p>
              <h3>{companies.filter(c => c.status === "Active").length}</h3>
            </div>
          </div>
          <div className="company-stat-card">
            <span>⏳</span>
            <div>
              <p>Pending Approval</p>
              <h3>{companies.filter(c => c.status === "Pending").length}</h3>
            </div>
          </div>
        </div>

        <div className="companies-toolbar">
          <input
            type="search"
            placeholder="Search company, email or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="companies-table-card">
          <div className="companies-table-title">
            <h5>Registered Companies</h5>
            <span>{filteredCompanies.length} companies found</span>
          </div>

          <div className="companies-table-wrapper">
            <table className="table companies-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Job Posts</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td>
                        <div className="company-table-info">
                          <div className="company-table-logo">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <strong>{company.name}</strong>
                            <small>{company.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{company.industry}</td>
                      <td>{company.location}</td>
                      <td>{company.jobs}</td>
                      <td>
                        <span className={`company-status ${company.status.toLowerCase()}`}>
                          {company.status}
                        </span>
                      </td>
                      <td>
                        <div className="company-actions">
                          <button onClick={() => setSelectedCompany(company)}>
                            View
                          </button>
                          <button onClick={() => handleDelete(company.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="company-empty">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="company-modal-overlay" onClick={() => setShowForm(false)}>
            <div className="company-modal" onClick={(e) => e.stopPropagation()}>
              <div className="company-modal-heading">
                <h5>Add New Company</h5>
                <button type="button" onClick={() => setShowForm(false)}>✕</button>
              </div>

              <form onSubmit={handleAddCompany}>
                <label>Company Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Enter company name"
                />

                <label>Official Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="hr@company.com"
                />

                <label>Industry</label>
                <input
                  required
                  value={form.industry}
                  onChange={(e) => setForm({...form, industry: e.target.value})}
                  placeholder="e.g. IT Services"
                />

                <label>Location</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  placeholder="Enter city"
                />

                <label>Website</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm({...form, website: e.target.value})}
                  placeholder="www.company.com"
                />

                <button className="company-save-btn" type="submit">
                  Add Company
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedCompany && (
          <div className="company-modal-overlay" onClick={() => setSelectedCompany(null)}>
            <div className="company-modal" onClick={(e) => e.stopPropagation()}>
              <div className="company-modal-heading">
                <h5>Company Details</h5>
                <button onClick={() => setSelectedCompany(null)}>✕</button>
              </div>
              <div className="company-detail-logo">
                {selectedCompany.name.charAt(0)}
              </div>
              <h4 className="company-detail-name">{selectedCompany.name}</h4>
              <div className="company-detail-list">
                <p><strong>Email:</strong> {selectedCompany.email}</p>
                <p><strong>Industry:</strong> {selectedCompany.industry}</p>
                <p><strong>Location:</strong> {selectedCompany.location}</p>
                <p><strong>Website:</strong> {selectedCompany.website || "Not provided"}</p>
                <p><strong>Job Posts:</strong> {selectedCompany.jobs}</p>
                <p><strong>Status:</strong> {selectedCompany.status}</p>
              </div>
              <button className="company-save-btn" onClick={() => setSelectedCompany(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageCompanies;
