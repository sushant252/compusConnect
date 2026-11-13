
import { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import "./MyProfile.css";

function MyProfile() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "9876543210",
    enrollmentNumber: "CC2022001",
    branch: "Computer Science",
    cgpa: "8.5",
    graduationYear: "2026",
    location: "Ghaziabad, Uttar Pradesh",
    about:
      "Computer Science student interested in web development and software engineering.",
  });

  const [skills, setSkills] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (skill && !skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setSkills((prev) => [...prev, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume size should be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setResume(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(profile.cgpa) < 0 || Number(profile.cgpa) > 10) {
      alert("CGPA must be between 0 and 10.");
      return;
    }

    alert("Profile updated successfully! (Demo only)");
    console.log("Profile:", profile);
    console.log("Skills:", skills);
    console.log("Resume:", resume);
  };

  return (
    <StudentLayout
      title="My Profile"
      subtitle="View and manage your student profile"
      contentClassName="my-profile-page"
    >
      <div className="student-layout">
       <main className="student-main">
         
      <form onSubmit={handleSubmit} >
        {/* Profile Overview */}
        <div className="profile-overview-card">
          <div className="profile-avatar-large">RS</div>

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
                onChange={handleChange}
                placeholder="Enter your email"
                required
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
                required
              />
            </div>

            <div className="profile-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <div className="profile-field full-width">
              <label>About Me</label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                rows="4"
                placeholder="Write a short introduction about yourself"
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
                onChange={handleChange}
                placeholder="Enter enrollment number"
                required
              />
            </div>

            <div className="profile-field">
              <label>Branch</label>
              <select
                name="branch"
                value={profile.branch}
                onChange={handleChange}
              >
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
                {Array.from({ length: 9 }, (_, i) => 2026 + i).map((year) => (
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
              <p>Upload your latest resume (PDF or Word, max 5 MB).</p>
            </div>
            <span className="profile-section-icon">▧</span>
          </div>

          <label className="resume-upload-box">
            <span className="resume-upload-icon">↑</span>
            <strong>Choose your resume</strong>
            <small>Click to select a PDF or Word document</small>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
          </label>

          {resume && (
            <div className="selected-resume">
              <span>▤</span>
              <div>
                <strong>{resume.name}</strong>
                <small>{(resume.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
              <button
                type="button"
                onClick={() => setResume(null)}
                aria-label="Remove selected resume"
              >
                ×
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

          <button type="submit" className="profile-save-btn">
            Save Changes
          </button>
        </div>
      </form>

      </main>
      </div>
    </StudentLayout>
  );
}


export default MyProfile;
