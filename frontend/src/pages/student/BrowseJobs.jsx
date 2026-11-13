
import { useMemo, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import "./BrowseJobs.css"
const jobsData = [
  {
    id: 1,
    company: "Tech Solutions",
    role: "Frontend Developer",
    location: "Noida",
    salary: "6 LPA",
    type: "Full-time",
    deadline: "25 Nov 2026",
    category: "IT",
    logo: "TS",
    description:
      "Work with React, JavaScript and modern frontend technologies to build responsive web applications.",
    skills: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    id: 2,
    company: "Innovate Labs",
    role: "Software Engineer",
    location: "Bangalore",
    salary: "8 LPA",
    type: "Full-time",
    deadline: "28 Nov 2026",
    category: "IT",
    logo: "IL",
    description:
      "Join the engineering team to develop scalable software solutions and collaborate on product development.",
    skills: ["Java", "DSA", "OOP", "SQL"],
  },
  {
    id: 3,
    company: "Digital Systems",
    role: "React Developer",
    location: "Gurugram",
    salary: "5 LPA",
    type: "Internship",
    deadline: "30 Nov 2026",
    category: "IT",
    logo: "DS",
    description:
      "Build user interfaces using React and work closely with designers and backend developers.",
    skills: ["React", "JavaScript", "Bootstrap"],
  },
  {
    id: 4,
    company: "DataSphere",
    role: "Data Analyst",
    location: "Pune",
    salary: "7 LPA",
    type: "Full-time",
    deadline: "02 Dec 2026",
    category: "Analytics",
    logo: "DA",
    description:
      "Analyze datasets, prepare reports and help teams make data-driven business decisions.",
    skills: ["Python", "SQL", "Excel", "Power BI"],
  },
  {
    id: 5,
    company: "CloudNine",
    role: "Backend Developer",
    location: "Remote",
    salary: "9 LPA",
    type: "Full-time",
    deadline: "05 Dec 2026",
    category: "IT",
    logo: "CN",
    description:
      "Develop APIs and backend services with a focus on performance, reliability and security.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
  },
  {
    id: 6,
    company: "Creative Minds",
    role: "UI/UX Designer",
    location: "Delhi",
    salary: "4 LPA",
    type: "Internship",
    deadline: "08 Dec 2026",
    category: "Design",
    logo: "CM",
    description:
      "Create user-friendly interfaces, wireframes and prototypes for web and mobile products.",
    skills: ["Figma", "Wireframing", "Prototyping"],
  },
];

function BrowseJobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [salary, setSalary] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const searchMatch =
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());

      const locationMatch =
        location === "All" || job.location === location;

      const typeMatch =
        jobType === "All" || job.type === jobType;

      const salaryNumber = Number.parseFloat(job.salary);
      const salaryMatch =
        salary === "All" ||
        (salary === "0-5" && salaryNumber <= 5) ||
        (salary === "5-8" && salaryNumber > 5 && salaryNumber <= 8) ||
        (salary === "8+" && salaryNumber > 8);

      return searchMatch && locationMatch && typeMatch && salaryMatch;
    });
  }, [search, location, jobType, salary]);

  const handleApply = (job) => {
    alert(`Demo: Application started for ${job.role} at ${job.company}.`);
  };

  return (
     <StudentLayout
    title="Browse Jobs"
    subtitle="Explore opportunities and find your next role"
    contentClassName="jobs-content"
  >
    <div className="student-layout">
    

      <main className="student-main">
     

        <section className="dashboard-content">
          <div className="jobs-welcome">
            <div>
              <span className="welcome-label">YOUR NEXT OPPORTUNITY</span>
              <h2>Find a job that fits your future.</h2>
              <p>
                Discover openings from companies hiring through your campus.
              </p>
            </div>
            <div className="jobs-welcome-icon">💼</div>
          </div>

          <div className="jobs-filter-card">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label">Search jobs</label>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Job title or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-lg-2 col-md-6">
                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="All">All locations</option>
                  <option value="Noida">Noida</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6">
                <label className="form-label">Job type</label>
                <select
                  className="form-select"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="All">All types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6">
                <label className="form-label">Salary</label>
                <select
                  className="form-select"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                >
                  <option value="All">Any salary</option>
                  <option value="0-5">Up to 5 LPA</option>
                  <option value="5-8">5–8 LPA</option>
                  <option value="8+">Above 8 LPA</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-12">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearch("");
                    setLocation("All");
                    setJobType("All");
                    setSalary("All");
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>

          <div className="jobs-results-heading">
            <div>
              <h5>Available Opportunities</h5>
              <p className="text-muted mb-0">
                Showing {filteredJobs.length} of {jobsData.length} jobs
              </p>
            </div>
            <span className="jobs-count">{filteredJobs.length} Jobs Found</span>
          </div>

          <div className="row g-4">
            {filteredJobs.map((job) => (
              <div className="col-xl-6" key={job.id}>
                <article className="browse-job-card">
                  <div className="browse-job-top">
                    <div className="company-logo">{job.logo}</div>
                    <div className="flex-grow-1">
                      <h6>{job.role}</h6>
                      <p>{job.company}</p>
                    </div>
                    <span className="job-type-badge">{job.type}</span>
                  </div>

                  <div className="browse-job-meta">
                    <span>📍 {job.location}</span>
                    <span>₹ {job.salary}</span>
                    <span>⏳ Apply by {job.deadline}</span>
                  </div>

                  <div className="job-skills">
                    {job.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="browse-job-actions">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now →
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="jobs-empty-state">
              <div>🔎</div>
              <h5>No jobs found</h5>
              <p>Try changing your search or filters.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearch("");
                  setLocation("All");
                  setJobType("All");
                  setSalary("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          <footer className="dashboard-footer">
            © 2026 CampusConnect. All rights reserved.
          </footer>
        </section>
      </main>

      {selectedJob && (
        <div
          className="job-modal-backdrop"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="job-modal-close"
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="company-logo mb-3">{selectedJob.logo}</div>
            <h4 id="job-modal-title">{selectedJob.role}</h4>
            <p className="text-muted">{selectedJob.company}</p>
            <hr />
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Salary:</strong> {selectedJob.salary}</p>
            <p><strong>Job type:</strong> {selectedJob.type}</p>
            <p><strong>Application deadline:</strong> {selectedJob.deadline}</p>
            <p className="mt-3">{selectedJob.description}</p>
            <strong>Required skills</strong>
            <div className="job-skills mt-2">
              {selectedJob.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <button
              className="btn btn-primary w-100 mt-4"
              onClick={() => handleApply(selectedJob)}
            >
              Apply Now →
            </button>
          </div>
        </div>
      )}
    </div>
     </StudentLayout>
  );
}

export default BrowseJobs;
