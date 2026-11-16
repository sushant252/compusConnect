
import { useEffect, useMemo, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./MyApplications.css";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const filters = [
        "All",
        "Pending",
        "Shortlisted",
        "Rejected",
        "Selected"
    ];

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get("/applications/my");

                setApplications(response.data.applications || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load applications. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            const company =
                application.job?.company?.name || "Company";

            const role = application.job?.title || "";

            const matchesSearch =
                company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                role.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                activeFilter === "All" ||
                application.status === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [applications, searchTerm, activeFilter]);

    const totalApplications = applications.length;

    const shortlisted = applications.filter(
        (app) => app.status === "Shortlisted"
    ).length;

    const pending = applications.filter(
        (app) => app.status === "Pending"
    ).length;

    const rejected = applications.filter(
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

    const colors = ["blue", "purple", "orange", "green", "pink"];

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

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
                            <div
                                className="application-stat-card"
                                key={stat.label}
                            >
                                <div className={`application-stat-icon ${stat.color}`}>
                                    {stat.icon}
                                </div>

                                <div>
                                    <h3>
                                        {stat.value.toString().padStart(2, "0")}
                                    </h3>
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
                                    Showing {filteredApplications.length} of{" "}
                                    {totalApplications} applications
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="applications-empty">
                                <h4>Loading applications...</h4>
                                <p>Please wait while we fetch your applications.</p>
                            </div>
                        ) : error ? (
                            <div className="applications-empty">
                                <h4>Something went wrong</h4>
                                <p>{error}</p>
                            </div>
                        ) : filteredApplications.length > 0 ? (
                            filteredApplications.map((application, index) => {
                                const company =
                                    application.job?.company?.name || "Company";

                                const role =
                                    application.job?.title || "Job unavailable";

                                const location =
                                    application.job?.location || "Not specified";

                                const salary =
                                    application.job?.salary || "Not disclosed";

                                const logo = company.charAt(0).toUpperCase();

                                const appliedDate =
                                    application.appliedAt || application.createdAt;

                                const status =
                                    application.status || "Pending";

                                return (
                                    <div
                                        className="application-card"
                                        key={application._id}
                                    >
                                        <div
                                            className={`application-company-logo ${
                                                colors[index % colors.length]
                                            }`}
                                        >
                                            {logo}
                                        </div>

                                        <div className="application-main-info">
                                            <h4>{role}</h4>

                                            <p className="application-company">
                                                {company}
                                            </p>

                                            <div className="application-meta">
                                                <span>⌖ {location}</span>
                                                <span>₹ {salary}</span>
                                                <span>
                                                    Applied: {formatDate(appliedDate)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="application-card-right">
                                            <span
                                                className={`application-status ${status.toLowerCase()}`}
                                            >
                                                {status}
                                            </span>

                                            <small>
                                                Application #
                                                {application._id.slice(-6).toUpperCase()}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="applications-empty">
                                <div>⌕</div>
                                <h4>
                                    {applications.length === 0
                                        ? "No applications yet"
                                        : "No applications found"}
                                </h4>
                                <p>
                                    {applications.length === 0
                                        ? "Your submitted job applications will appear here."
                                        : "Try changing your search or selecting another status."}
                                </p>

                                {applications.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setActiveFilter("All");
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </StudentLayout>
    );
}

export default MyApplications;
