
import AdminLayout from "../../layouts/AdminLayout";
import "./Reports.css";

const branchData = [
  { name: "Computer Science", total: 320, placed: 260 },
  { name: "Information Technology", total: 240, placed: 190 },
  { name: "Electronics", total: 180, placed: 125 },
  { name: "Mechanical", total: 150, placed: 90 },
  { name: "Civil", total: 110, placed: 55 },
];

const monthlyData = [
  { month: "July", count: 25 },
  { month: "August", count: 42 },
  { month: "September", count: 58 },
  { month: "October", count: 75 },
  { month: "November", count: 96 },
  { month: "December", count: 65 },
];

const companyData = [
  { name: "Tech Solutions", students: 45, package: "8 LPA" },
  { name: "Innovate Labs", students: 38, package: "12 LPA" },
  { name: "CloudTech", students: 32, package: "10 LPA" },
  { name: "Digital Systems", students: 27, package: "7 LPA" },
  { name: "DataSphere", students: 20, package: "6 LPA" },
];

function Reports() {
  const totalStudents = 1000;
  const placedStudents = 720;
  const placementPercentage = Math.round(
    (placedStudents / totalStudents) * 100
  );

  const downloadCSV = () => {
    const rows = [
      ["Branch", "Total Students", "Placed Students", "Placement Percentage"],
      ...branchData.map((branch) => [
        branch.name,
        branch.total,
        branch.placed,
        `${Math.round((branch.placed / branch.total) * 100)}%`,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CampusConnect_Placement_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      title="Reports & Analytics"
      subtitle="Track placement performance and college statistics"
    >
      <div className="reports-page">
        <div className="reports-heading">
          <div>
            <h2>Placement Overview</h2>
            <p>Academic Year 2026–27 · Sample analytics data</p>
          </div>

          <button className="download-report-btn" onClick={downloadCSV}>
            <i className="bi bi-download"></i> Export CSV
          </button>
        </div>

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
            <small>Successfully placed</small>
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
            <h3>6.8 LPA</h3>
            <small>Among placed students</small>
          </div>
        </div>

        {/* Placement Progress */}
        <div className="report-card placement-progress-card">
          <div className="report-card-heading">
            <div>
              <h4>Overall Placement Progress</h4>
              <p>Placement status of registered students</p>
            </div>
            <span className="report-percentage">{placementPercentage}%</span>
          </div>

          <div className="placement-progress-track">
            <div
              className="placement-progress-fill"
              style={{ width: `${placementPercentage}%` }}
            ></div>
          </div>

          <div className="placement-progress-legend">
            <span><i className="legend-dot placed-dot"></i> Placed: 720</span>
            <span><i className="legend-dot unplaced-dot"></i> Not Placed: 280</span>
          </div>
        </div>

        {/* Monthly Placement Chart */}
        <div className="report-card monthly-chart-card">
          <div className="report-card-heading">
            <div>
              <h4>Monthly Placement Performance</h4>
              <p>Number of students placed each month</p>
            </div>
          </div>

          <div className="monthly-chart">
            {monthlyData.map((item) => (
              <div className="monthly-chart-column" key={item.month}>
                <span className="monthly-chart-value">{item.count}</span>
                <div className="monthly-bar-wrapper">
                  <div
                    className="monthly-bar"
                    style={{ height: `${(item.count / 100) * 100}%` }}
                  ></div>
                </div>
                <span className="monthly-chart-label">{item.month}</span>
              </div>
            ))}
          </div>
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
                {branchData.map((branch) => {
                  const percentage = Math.round(
                    (branch.placed / branch.total) * 100
                  );

                  return (
                    <tr key={branch.name}>
                      <td className="branch-name">{branch.name}</td>
                      <td>{branch.total}</td>
                      <td className="placed-number">{branch.placed}</td>
                      <td>{branch.total - branch.placed}</td>
                      <td>
                        <div className="branch-rate">
                          <span>{percentage}%</span>
                          <div className="branch-rate-track">
                            <div
                              className="branch-rate-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company-wise Report */}
        <div className="report-card company-report-card">
          <div className="report-card-heading">
            <div>
              <h4>Company-wise Placement Report</h4>
              <p>Top recruiting companies and their offers</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table reports-table align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Students Placed</th>
                  <th>Package</th>
                </tr>
              </thead>

              <tbody>
                {companyData.map((company) => (
                  <tr key={company.name}>
                    <td className="branch-name">{company.name}</td>
                    <td>{company.students}</td>
                    <td className="package-highlight">{company.package}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlights */}
        <div className="report-highlights">
          <div>
            <i className="bi bi-trophy-fill"></i>
            <span>
              Highest Package
              <strong>18 LPA</strong>
            </span>
          </div>

          <div>
            <i className="bi bi-building"></i>
            <span>
              Recruiting Companies
              <strong>48</strong>
            </span>
          </div>

          <div>
            <i className="bi bi-briefcase-fill"></i>
            <span>
              Total Job Opportunities
              <strong>156</strong>
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
