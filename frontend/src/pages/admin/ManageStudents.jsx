import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "./ManageStudents.css";

const initialStudents = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    enrollment: "CC2022001",
    branch: "Computer Science",
    cgpa: "8.5",
    year: "2026",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya@gmail.com",
    enrollment: "CC2022002",
    branch: "Information Technology",
    cgpa: "9.1",
    year: "2026",
    phone: "9876543211",
  },
  {
    id: 3,
    name: "Aman Gupta",
    email: "aman@gmail.com",
    enrollment: "CC2022003",
    branch: "Mechanical",
    cgpa: "7.8",
    year: "2027",
    phone: "9876543212",
  },
  {
    id: 4,
    name: "Sneha Singh",
    email: "sneha@gmail.com",
    enrollment: "CC2022004",
    branch: "Electronics",
    cgpa: "8.9",
    year: "2026",
    phone: "9876543213",
  },
  {
    id: 5,
    name: "Arjun Patel",
    email: "arjun@gmail.com",
    enrollment: "CC2022005",
    branch: "Civil",
    cgpa: "7.5",
    year: "2027",
    phone: "9876543214",
  },
  {
    id: 6,
    name: "Neha Kumari",
    email: "neha@gmail.com",
    enrollment: "CC2022006",
    branch: "Computer Science",
    cgpa: "8.7",
    year: "2026",
    phone: "9876543215",
  },
];

function ManageStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmed) {
      setStudents((prev) =>
        prev.filter((student) => student.id !== id)
      );

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    }
  };

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
              <h3>
                {students.filter(
                  (s) => s.branch === "Computer Science"
                ).length}
              </h3>
            </div>
          </div>

          <div className="students-stat-card">
            <span>🎓</span>
            <div>
              <p>Graduating in 2026</p>
              <h3>
                {students.filter((s) => s.year === "2026").length}
              </h3>
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
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electronics">Electronics</option>
            <option value="Civil">Civil</option>
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-table-profile">
                          <div className="student-table-avatar">
                            {student.name.charAt(0)}
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
                            onClick={() => setSelectedStudent(student)}
                          >
                            View
                          </button>

                          <button
                            className="student-delete-btn"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
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
                <button onClick={() => setSelectedStudent(null)}>
                  ✕
                </button>
              </div>

              <div className="student-modal-profile">
                <div className="student-modal-avatar">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h4>{selectedStudent.name}</h4>
                <p>{selectedStudent.email}</p>
              </div>

              <div className="student-details-list">
                <p><strong>Enrollment:</strong> {selectedStudent.enrollment}</p>
                <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                <p><strong>Branch:</strong> {selectedStudent.branch}</p>
                <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
                <p><strong>Passing Year:</strong> {selectedStudent.year}</p>
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