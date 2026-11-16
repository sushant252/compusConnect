
import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import API from "../../services/api";
import "./MyProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    enrollmentNumber: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    location: "",
    about: "",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [resumeName, setResumeName] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/profile/me");
        const student = response.data.student;

        setProfile({
          name: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          enrollmentNumber: student.enrollmentNumber || "",
          branch: student.branch || "",
          cgpa: student.cgpa ?? "",
          graduationYear: student.graduationYear || "",
          location: "",
          about: "",
        });

        setSkills(student.skills || []);

        if (student.resume) {
          setResumeName(
            student.resume.split(/[\\/]/).pop()
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add skill
  const addSkill = () => {
    const skill = newSkill.trim();

    if (
      skill &&
      !skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkills((prev) => [...prev, skill]);
      setNewSkill("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      profile.cgpa === "" ||
      Number(profile.cgpa) < 0 ||
      Number(profile.cgpa) > 10
    ) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        name: profile.name,
        phone: profile.phone,
        branch: profile.branch,
        cgpa: Number(profile.cgpa),
        graduationYear: Number(profile.graduationYear),
        skills,
      };

      const response = await API.put("/profile/me", profileData);

      const updatedStudent = response.data.student;

      setProfile((prev) => ({
        ...prev,
        name: updatedStudent.name || "",
        email: updatedStudent.email || "",
        phone: updatedStudent.phone || "",
        enrollmentNumber: updatedStudent.enrollmentNumber || "",
        branch: updatedStudent.branch || "",
        cgpa: updatedStudent.cgpa ?? "",
        graduationYear: updatedStudent.graduationYear || "",
      }));

      setSkills(updatedStudent.skills || []);

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Upload resume
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a PDF file only.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size should be less than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      await API.post("/profile/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeName(file.name);
      setSelectedResume(file);
      setSuccess("Resume uploaded successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to upload resume."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Download resume
  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      setError("");

      const response = await API.get(
        "/profile/resume/download",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = resumeName || "MyResume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      setError("Unable to download resume.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout
        title="My Profile"
        subtitle="View and manage your student profile"
      >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading your profile...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      title="My Profile"
      subtitle="View and manage your student profile"
      contentClassName="my-profile-page"
    >
      <div className="student-layout">
        <main className="student-main">

          <form onSubmit={handleSubmit}>

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

            {/* Profile Overview */}
            <div className="profile-overview-card">
              <div className="profile-avatar-large">
                {profile.name
                  ? profile.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "ST"}
              </div>

              <div className="profile-overview-info">
                <h3>{profile.name || "Your Name"}</h3>
                <p>{profile.branch} Student</p>
                <span>{profile.email}</span>
              </div>

              <div className="profile-completion">
                <span>Student Profile</span>
                <strong>CampusConnect</strong>
              </div>
            </div>

            {/* Personal Information */}
            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div>
                  <h3>Personal Information</h3>
                  <p>Update your basic contact details.</p>
                </div>
                <span className="profile-section-icon">♙</span>
              </div>

              <div className="profile-form-grid">

                <div className="profile-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    readOnly
                  />
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="profile-field">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    placeholder="Location is not supported yet"
                    disabled
                  />
                </div>

                <div className="profile-field full-width">
                  <label>About Me</label>
                  <textarea
                    name="about"
                    value={profile.about}
                    rows="4"
                    placeholder="About Me is not supported yet"
                    disabled
                  />
                </div>

              </div>
            </div>

            {/* Academic Information */}
            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div>
                  <h3>Academic Information</h3>
                  <p>Your college and academic details.</p>
                </div>
                <span className="profile-section-icon">▤</span>
              </div>

              <div className="profile-form-grid">

                <div className="profile-field">
                  <label>Enrollment Number</label>
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={profile.enrollmentNumber}
                    readOnly
                  />
                </div>

                <div className="profile-field">
                  <label>Branch</label>
                  <select
                    name="branch"
                    value={profile.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Electrical</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="profile-field">
                  <label>Current CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    value={profile.cgpa}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.01"
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>Graduation Year</label>
                  <select
                    name="graduationYear"
                    value={profile.graduationYear}
                    onChange={handleChange}
                  >
                    {Array.from(
                      { length: 9 },
                      (_, i) => 2026 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Skills */}
            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div>
                  <h3>My Skills</h3>
                  <p>Add the technical skills you know.</p>
                </div>
                <span className="profile-section-icon">✧</span>
              </div>

              <div className="profile-skills-list">
                {skills.map((skill) => (
                  <span className="profile-skill-tag" key={skill}>
                    {skill}

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="add-skill-row">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Enter a skill, e.g. Python"
                />

                <button type="button" onClick={addSkill}>
                  + Add Skill
                </button>
              </div>
            </div>

            {/* Resume */}
            <div className="profile-section-card">
              <div className="profile-section-heading">
                <div>
                  <h3>My Resume</h3>
                  <p>Upload your latest resume (PDF, max 5 MB).</p>
                </div>
                <span className="profile-section-icon">▧</span>
              </div>

              <label className="resume-upload-box">
                <span className="resume-upload-icon">↑</span>
                <strong>
                  {uploading ? "Uploading..." : "Choose your resume"}
                </strong>
                <small>
                  Click to select a PDF document
                </small>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                  disabled={uploading}
                />
              </label>

              {resumeName && (
                <div className="selected-resume">
                  <span>▤</span>

                  <div>
                    <strong>{resumeName}</strong>
                    <small>
                      {selectedResume
                        ? `${(selectedResume.size / 1024 / 1024).toFixed(2)} MB`
                        : "Previously uploaded resume"}
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloading}
                  >
                    {downloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              )}
            </div>

            {/* Save Actions */}
            <div className="profile-save-actions">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </main>
      </div>
    </StudentLayout>
  );
}

export default MyProfile;
