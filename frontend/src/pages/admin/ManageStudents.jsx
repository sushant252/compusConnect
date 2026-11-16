
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";
import "./ManageStudents.css";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState("");
  const [resumeLoading, setResumeLoading] = useState("");

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/students");

      const formattedStudents = (response.data.students || []).map(
        (student) => ({
          id: student._id,
          name: student.name || "N/A",
          email: student.email || "N/A",
          enrollment: student.enrollmentNumber || "N/A",
          branch: student.branch || "Not Specified",
          cgpa: student.cgpa ?? "N/A",
          year: student.graduationYear ?? "N/A",
          phone: student.phone || "N/A",
          hasResume: Boolean(student.resume),
        })
      );

      setStudents(formattedStudents);
    } catch (err) {
      console.error("Fetch Students Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search and branch filter
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(searchText) ||
        student.email.toLowerCase().includes(searchText) ||
        student.enrollment.toLowerCase().includes(searchText);

      const matchesBranch =
        branch === "All" || student.branch === branch;

      return matchesSearch && matchesBranch;
    });
  }, [students, search, branch]);

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);
      setError("");

      await API.delete(`/admin/students/${id}`);

      setStudents((prev) =>
        prev.filter((student) => student.id !== id)
      );

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }

      alert("Student deleted successfully!");
    } catch (err) {
      console.error("Delete Student Error:", err);
      alert(
        err.response?.data?.message ||
          "Unable to delete student. Please try again."
      );
    } finally {
      setDeleteLoading("");
    }
  };

  // View or download student resume
  const handleResume = async (student, download = false) => {
    try {
      setResumeLoading(student.id);

      const response = await API.get(
        `/admin/students/${student.id}/resume${
          download ? "?download=true" : ""
        }`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = window.URL.createObjectURL(blob);

      if (download) {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `${student.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(fileURL);
      } else {
        const pdfWindow = window.open("", "_blank");

        if (pdfWindow) {
          pdfWindow.location.href = fileURL;
          setTimeout(() => {
            window.URL.revokeObjectURL(fileURL);
          }, 60000);
        } else {
          window.URL.revokeObjectURL(fileURL);
          alert("Please allow pop-ups to view the resume.");
        }
      }
    } catch (err) {
      console.error("Resume Error:", err);

      alert(
        "Unable to open resume. Please check whether the student has uploaded a valid PDF."
      );
    } finally {
      setResumeLoading("");
    }
  };

  // Dynamic statistics
  const computerScienceCount = students.filter(
    (student) => student.branch === "Computer Science"
  ).length;

  const graduating2026Count = students.filter(
    (student) => String(student.year) === "2026"
  ).length;

  const branches = [
    ...new Set(students.map((student) => student.branch)),
  ].filter((item) => item !== "Not Specified");

  return (
    <AdminLayout
      title="Manage Students"
      subtitle="View and manage registered students"
    >
      <div className="manage-students-page">

        {/* Page Heading */}
        <div className="students-page-heading">
          <div>
            <h2>Student Management</h2>
            <p>Manage all registered students in one place.</p>
          </div>

          <div className="students-total-badge">
            👨‍🎓 {students.length} Students
          </div>
        </div>

        {/* Statistics */}
        <div className="students-stats">
          <div className="students-stat-card">
            <span>👨‍🎓</span>
            <div>
              <p>Total Students</p>
              <h3>{students.length}</h3>
            </div>
          </div>

          <div className="students-stat-card">
            <span>💻</span>
            <div>
              <p>Computer Science</p>
              <h3>{computerScienceCount}</h3>
            </div>
          </div>

          <div className="students-stat-card">
            <span>🎓</span>
            <div>
              <p>Graduating in 2026</p>
              <h3>{graduating2026Count}</h3>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="students-toolbar">
          <div className="students-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search name, email or enrollment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="All">All Branches</option>

            {branches.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Student Table */}
        <div className="students-table-card">
          <div className="students-table-heading">
            <div>
              <h5>Registered Students</h5>
              <p>{filteredStudents.length} records found</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mx-3">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={fetchStudents}
              >
                Retry
              </button>
            </div>
          )}

          <div className="students-table-wrapper">
            <table className="table students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Enrollment No.</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Passing Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="students-empty">
                      Loading students...
                    </td>
                  </tr>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-table-profile">
                          <div className="student-table-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{student.name}</strong>
                            <small>{student.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{student.enrollment}</td>
                      <td>{student.branch}</td>

                      <td>
                        <span className="student-cgpa">
                          {student.cgpa}
                        </span>
                      </td>

                      <td>{student.year}</td>

                      <td>
                        <div className="student-action-buttons">
                          <button
                            className="student-view-btn"
                            onClick={() =>
                              setSelectedStudent(student)
                            }
                          >
                            View
                          </button>

                          <button
                            className="student-delete-btn"
                            onClick={() =>
                              handleDelete(student.id)
                            }
                            disabled={deleteLoading === student.id}
                          >
                            {deleteLoading === student.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="students-empty">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div
            className="student-modal-overlay"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="student-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="student-modal-header">
                <h5>Student Details</h5>

                <button
                  onClick={() => setSelectedStudent(null)}
                >
                  ✕
                </button>
              </div>

              <div className="student-modal-profile">
                <div className="student-modal-avatar">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>

                <h4>{selectedStudent.name}</h4>
                <p>{selectedStudent.email}</p>
              </div>

              <div className="student-details-list">
                <p>
                  <strong>Enrollment:</strong>{" "}
                  {selectedStudent.enrollment}
                </p>

                <p>
                  <strong>Phone:</strong> {selectedStudent.phone}
                </p>

                <p>
                  <strong>Branch:</strong> {selectedStudent.branch}
                </p>

                <p>
                  <strong>CGPA:</strong> {selectedStudent.cgpa}
                </p>

                <p>
                  <strong>Passing Year:</strong> {selectedStudent.year}
                </p>
              </div>

              {/* Resume Section */}
              <div className="student-resume-section">
                <h6>📄 Student Resume</h6>

                {selectedStudent.hasResume ? (
                  <>
                    <p className="resume-uploaded">
                      <span>●</span> Resume Uploaded
                    </p>

                    <div className="student-resume-actions">
                      <button
                        className="student-resume-view-btn"
                        onClick={() =>
                          handleResume(selectedStudent, false)
                        }
                        disabled={resumeLoading === selectedStudent.id}
                      >
                        {resumeLoading === selectedStudent.id
                          ? "Loading..."
                          : "View Resume"}
                      </button>

                      <button
                        className="student-resume-download-btn"
                        onClick={() =>
                          handleResume(selectedStudent, true)
                        }
                        disabled={resumeLoading === selectedStudent.id}
                      >
                        Download Resume
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="resume-not-uploaded">
                    Resume not uploaded by this student.
                  </p>
                )}
              </div>

              <button
                className="student-modal-close"
                onClick={() => setSelectedStudent(null)}
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

export default ManageStudents;
