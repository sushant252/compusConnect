
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./Reports.css";

function Reports() {
  const [reportData, setReportData] = useState({
    overview: {
      totalStudents: 0,
      placedStudents: 0,
      placementPercentage: 0,
      averagePackage: null,
      highestPackage: null,
      totalCompanies: 0,
      totalJobs: 0,
      totalJobOpportunities: 0,
    },
    branchData: [],
    monthlyData: [],
    companyData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/admin/reports");

        setReportData({
          overview: response.data.overview,
          branchData: response.data.branchData || [],
          monthlyData: response.data.monthlyData || [],
          companyData: response.data.companyData || [],
        });
      } catch (err) {
        console.error("Reports fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load reports data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const {
    totalStudents,
    placedStudents,
    placementPercentage,
    averagePackage,
    highestPackage,
    totalCompanies,
    totalJobOpportunities,
  } = reportData.overview;

  const notPlacedStudents = Math.max(
    totalStudents - placedStudents,
    0
  );

  const downloadCSV = () => {
    const rows = [
      ["CAMPUSCONNECT PLACEMENT REPORT"],
      [],
      ["OVERVIEW"],
      ["Metric", "Value"],
      ["Total Students", totalStudents],
      ["Placed Students", placedStudents],
      ["Not Placed Students", notPlacedStudents],
      ["Placement Rate", `${placementPercentage}%`],
      [
        "Average Advertised Package",
        averagePackage !== null ? `${averagePackage} LPA` : "N/A",
      ],
      [
        "Highest Advertised Package",
        highestPackage !== null ? `${highestPackage} LPA` : "N/A",
      ],
      ["Registered Companies", totalCompanies],
      ["Total Job Opportunities", totalJobOpportunities],
      [],
      ["BRANCH-WISE REPORT"],
      ["Branch", "Total Students", "Placed Students", "Not Placed", "Placement Rate"],
      ...reportData.branchData.map((branch) => [
        branch.name,
        branch.total,
        branch.placed,
        Math.max(branch.total - branch.placed, 0),
        branch.total
          ? `${Math.round((branch.placed / branch.total) * 100)}%`
          : "0%",
      ]),
      [],
      ["MONTHLY APPLICATION TREND"],
      ["Month", "Applications"],
      ...reportData.monthlyData.map((item) => [
        item.month,
        item.count,
      ]),
      [],
      ["COMPANY-WISE REPORT"],
      ["Company", "Selected Students", "Advertised Package"],
      ...reportData.companyData.map((company) => [
        company.name,
        company.students,
        company.package,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CampusConnect_Placement_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const getBranchPercentage = (branch) => {
    return branch.total
      ? Math.round((branch.placed / branch.total) * 100)
      : 0;
  };

  const maxMonthlyCount = Math.max(
    ...reportData.monthlyData.map((item) => item.count),
    1
  );

  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="Track placement performance and college statistics"
    >
      <div className="reports-page">

        <div className="reports-heading">
          <div>
            <h2>Placement Overview</h2>
            <p>Live analytics from CampusConnect database</p>
          </div>

          <button
            className="download-report-btn"
            onClick={downloadCSV}
            disabled={loading || !!error}
          >
            <i className="bi bi-download"></i> Export CSV
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading reports...</p>
          </div>
        ) : !error && (
          <>

            {/* Overview Cards */}
            <div className="reports-stats-grid">

              <div className="report-stat-card">
                <div className="report-stat-icon blue">
                  <i className="bi bi-people-fill"></i>
                </div>
                <span>Total Students</span>
                <h3>{totalStudents.toLocaleString("en-IN")}</h3>
                <small>Registered students</small>
              </div>

              <div className="report-stat-card">
                <div className="report-stat-icon green">
                  <i className="bi bi-person-check-fill"></i>
                </div>
                <span>Placed Students</span>
                <h3>{placedStudents}</h3>
                <small>Students with Selected status</small>
              </div>

              <div className="report-stat-card">
                <div className="report-stat-icon purple">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <span>Placement Rate</span>
                <h3>{placementPercentage}%</h3>
                <small>Overall placement ratio</small>
              </div>

              <div className="report-stat-card">
                <div className="report-stat-icon orange">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <span>Average Package</span>
                <h3>
                  {averagePackage !== null
                    ? `${averagePackage} LPA`
                    : "N/A"}
                </h3>
                <small>Based on advertised job salaries</small>
              </div>

            </div>

            {/* Placement Progress */}
            <div className="report-card placement-progress-card">

              <div className="report-card-heading">
                <div>
                  <h4>Overall Placement Progress</h4>
                  <p>Placement status of registered students</p>
                </div>

                <span className="report-percentage">
                  {placementPercentage}%
                </span>
              </div>

              <div className="placement-progress-track">
                <div
                  className="placement-progress-fill"
                  style={{
                    width: `${Math.min(placementPercentage, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="placement-progress-legend">
                <span>
                  <i className="legend-dot placed-dot"></i>
                  Placed: {placedStudents}
                </span>

                <span>
                  <i className="legend-dot unplaced-dot"></i>
                  Not Placed: {notPlacedStudents}
                </span>
              </div>

            </div>

            {/* Monthly Application Chart */}
            <div className="report-card monthly-chart-card">

              <div className="report-card-heading">
                <div>
                  <h4>Monthly Application Trend</h4>
                  <p>Number of applications received each month</p>
                </div>
              </div>

              {reportData.monthlyData.length > 0 ? (
                <div className="monthly-chart">
                  {reportData.monthlyData.map((item) => (
                    <div
                      className="monthly-chart-column"
                      key={item.month}
                    >
                      <span className="monthly-chart-value">
                        {item.count}
                      </span>

                      <div className="monthly-bar-wrapper">
                        <div
                          className="monthly-bar"
                          style={{
                            height: `${(item.count / maxMonthlyCount) * 100}%`,
                          }}
                        ></div>
                      </div>

                      <span className="monthly-chart-label">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted py-4">
                  No monthly application data available.
                </p>
              )}

            </div>

            {/* Branch-wise Report */}
            <div className="report-card branch-report-card">

              <div className="report-card-heading">
                <div>
                  <h4>Branch-wise Placement Report</h4>
                  <p>Placement performance across departments</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table reports-table align-middle">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>Total Students</th>
                      <th>Placed</th>
                      <th>Not Placed</th>
                      <th>Placement Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.branchData.length > 0 ? (
                      reportData.branchData.map((branch) => {
                        const percentage = getBranchPercentage(branch);

                        return (
                          <tr key={branch.name}>
                            <td className="branch-name">
                              {branch.name}
                            </td>

                            <td>{branch.total}</td>

                            <td className="placed-number">
                              {branch.placed}
                            </td>

                            <td>
                              {Math.max(branch.total - branch.placed, 0)}
                            </td>

                            <td>
                              <div className="branch-rate">
                                <span>{percentage}%</span>

                                <div className="branch-rate-track">
                                  <div
                                    className="branch-rate-fill"
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No branch data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Company-wise Report */}
            <div className="report-card company-report-card">

              <div className="report-card-heading">
                <div>
                  <h4>Company-wise Placement Report</h4>
                  <p>Companies with selected student applications</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table reports-table align-middle">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Students Selected</th>
                      <th>Advertised Package</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData.companyData.length > 0 ? (
                      reportData.companyData.map((company) => (
                        <tr key={company.name}>
                          <td className="branch-name">
                            {company.name}
                          </td>

                          <td>{company.students}</td>

                          <td className="package-highlight">
                            {company.package}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No selected student records available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Highlights */}
            <div className="report-highlights">

              <div>
                <i className="bi bi-trophy-fill"></i>
                <span>
                  Highest Advertised Package
                  <strong>
                    {highestPackage !== null
                      ? `${highestPackage} LPA`
                      : "N/A"}
                  </strong>
                </span>
              </div>

              <div>
                <i className="bi bi-building"></i>
                <span>
                  Registered Companies
                  <strong>{totalCompanies}</strong>
                </span>
              </div>

              <div>
                <i className="bi bi-briefcase-fill"></i>
                <span>
                  Total Job Opportunities
                  <strong>{totalJobOpportunities}</strong>
                </span>
              </div>

            </div>

          </>
        )}

      </div>
    </AdminLayout>
  );
}

export default Reports;
