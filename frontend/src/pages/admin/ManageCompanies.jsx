
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageCompanies.css";

const emptyForm = {
    name: "",
    email: "",
    industry: "",
    location: "",
    website: ""
};

function ManageCompanies() {
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ----------------------------------
    // FETCH COMPANIES AND JOBS
    // ----------------------------------

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [companyResponse, jobResponse] = await Promise.all([
                API.get("/companies"),
                API.get("/jobs")
            ]);

            setCompanies(companyResponse.data.companies || []);

            const jobList = Array.isArray(jobResponse.data)
                ? jobResponse.data
                : jobResponse.data.jobs || [];

            setJobs(jobList);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load companies"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ----------------------------------
    // HELPER FUNCTIONS
    // ----------------------------------

    const getCompanyEmail = (company) => {
        return company.contactEmail || "";
    };

    const getCompanyStatus = (company) => {
        return company.isActive === false ? "Pending" : "Active";
    };

    const getCompanyJobCount = (companyId) => {
        return jobs.filter((job) => {
            const jobCompany =
                typeof job.company === "object"
                    ? job.company?._id
                    : job.company;

            return String(jobCompany) === String(companyId);
        }).length;
    };

    // ----------------------------------
    // SEARCH AND FILTER
    // ----------------------------------

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const query = search.toLowerCase();

            const matchesSearch =
                (company.name || "").toLowerCase().includes(query) ||
                getCompanyEmail(company).toLowerCase().includes(query) ||
                (company.location || "").toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                getCompanyStatus(company) === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [companies, search, statusFilter]);

    // ----------------------------------
    // RESET FORM
    // ----------------------------------

    const resetForm = () => {
        setForm(emptyForm);
        setEditingCompany(null);
        setShowForm(false);
    };

    // ----------------------------------
    // OPEN ADD FORM
    // ----------------------------------

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingCompany(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // ----------------------------------
    // OPEN EDIT FORM
    // ----------------------------------

    const openEditForm = (company) => {
        setEditingCompany(company);

        setForm({
            name: company.name || "",
            email: company.contactEmail || "",
            industry: company.industry || "",
            location: company.location || "",
            website: company.website || ""
        });

        setSelectedCompany(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // ----------------------------------
    // HANDLE FORM INPUT
    // ----------------------------------

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ----------------------------------
    // ADD OR UPDATE COMPANY
    // ----------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
            name: form.name.trim(),
            contactEmail: form.email.trim().toLowerCase(),
            industry: form.industry.trim(),
            location: form.location.trim(),
            website: form.website.trim()
        };

        try {
            if (editingCompany) {
                await API.put(
                    `/companies/${editingCompany._id}`,
                    payload
                );

                setSuccess("Company updated successfully!");
            } else {
                await API.post("/companies", payload);

                setSuccess("Company added successfully!");
            }

            resetForm();
            await fetchData();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save company"
            );
        } finally {
            setSaving(false);
        }
    };

    // ----------------------------------
    // DELETE COMPANY
    // ----------------------------------

    const handleDelete = async (company) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${company.name}?`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await API.delete(`/companies/${company._id}`);

            setCompanies((prev) =>
                prev.filter((item) => item._id !== company._id)
            );

            if (selectedCompany?._id === company._id) {
                setSelectedCompany(null);
            }

            setSuccess("Company deleted successfully!");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete company"
            );
        }
    };

    return (
        <AdminLayout
            title="Manage Companies"
            subtitle="Manage registered recruiting companies"
        >
            <div className="manage-companies-page">

                {/* Heading */}
                <div className="companies-heading">
                    <div>
                        <h2>Company Management</h2>
                        <p>
                            Manage companies participating in campus placements.
                        </p>
                    </div>

                    <button
                        className="company-add-btn"
                        onClick={openAddForm}
                    >
                        + Add Company
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* Statistics */}
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
                            <h3>
                                {companies.filter(
                                    (c) => getCompanyStatus(c) === "Active"
                                ).length}
                            </h3>
                        </div>
                    </div>

                    <div className="company-stat-card">
                        <span>⏳</span>
                        <div>
                            <p>Pending Approval</p>
                            <h3>
                                {companies.filter(
                                    (c) => getCompanyStatus(c) === "Pending"
                                ).length}
                            </h3>
                        </div>
                    </div>

                </div>

                {/* Search and Filter */}
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

                {/* Companies Table */}
                <div className="companies-table-card">

                    <div className="companies-table-title">
                        <h5>Registered Companies</h5>
                        <span>
                            {filteredCompanies.length} companies found
                        </span>
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

                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="company-empty">
                                            Loading companies...
                                        </td>
                                    </tr>
                                ) : filteredCompanies.length > 0 ? (

                                    filteredCompanies.map((company) => (
                                        <tr key={company._id}>

                                            <td>
                                                <div className="company-table-info">

                                                    <div className="company-table-logo">
                                                        {company.name?.charAt(0)?.toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>{company.name}</strong>
                                                        <small>
                                                            {getCompanyEmail(company)}
                                                        </small>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>{company.industry || "N/A"}</td>

                                            <td>{company.location || "N/A"}</td>

                                            <td>
                                                {getCompanyJobCount(company._id)}
                                            </td>

                                            <td>
                                                <span
                                                    className={`company-status ${getCompanyStatus(company).toLowerCase()}`}
                                                >
                                                    {getCompanyStatus(company)}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="company-actions">

                                                    <button
                                                        onClick={() =>
                                                            setSelectedCompany(company)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openEditForm(company)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(company)
                                                        }
                                                    >
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

                {/* ADD / EDIT COMPANY MODAL */}
                {showForm && (
                    <div
                        className="company-modal-overlay"
                        onClick={resetForm}
                    >
                        <div
                            className="company-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="company-modal-heading">
                                <h5>
                                    {editingCompany
                                        ? "Edit Company"
                                        : "Add New Company"}
                                </h5>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <label>Company Name</label>
                                <input
                                    required
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter company name"
                                />

                                <label>Official Email</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    placeholder="hr@company.com"
                                />

                                <label>Industry</label>
                                <input
                                    required
                                    name="industry"
                                    value={form.industry}
                                    onChange={handleFormChange}
                                    placeholder="e.g. IT Services"
                                />

                                <label>Location</label>
                                <input
                                    required
                                    name="location"
                                    value={form.location}
                                    onChange={handleFormChange}
                                    placeholder="Enter city"
                                />

                                <label>Website</label>
                                <input
                                    name="website"
                                    value={form.website}
                                    onChange={handleFormChange}
                                    placeholder="www.company.com"
                                />

                                <button
                                    className="company-save-btn"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCompany
                                            ? "Update Company"
                                            : "Add Company"}
                                </button>

                            </form>
                        </div>
                    </div>
                )}

                {/* COMPANY DETAILS MODAL */}
                {selectedCompany && (
                    <div
                        className="company-modal-overlay"
                        onClick={() => setSelectedCompany(null)}
                    >
                        <div
                            className="company-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="company-modal-heading">
                                <h5>Company Details</h5>

                                <button
                                    onClick={() => setSelectedCompany(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="company-detail-logo">
                                {selectedCompany.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <h4 className="company-detail-name">
                                {selectedCompany.name}
                            </h4>

                            <div className="company-detail-list">

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {getCompanyEmail(selectedCompany)}
                                </p>

                                <p>
                                    <strong>Industry:</strong>{" "}
                                    {selectedCompany.industry || "N/A"}
                                </p>

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {selectedCompany.location || "N/A"}
                                </p>

                                <p>
                                    <strong>Website:</strong>{" "}
                                    {selectedCompany.website || "Not provided"}
                                </p>

                                <p>
                                    <strong>Job Posts:</strong>{" "}
                                    {getCompanyJobCount(selectedCompany._id)}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {getCompanyStatus(selectedCompany)}
                                </p>

                            </div>

                            <button
                                className="company-save-btn"
                                onClick={() => setSelectedCompany(null)}
                            >
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
