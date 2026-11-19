import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    enrollmentNumber: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        enrollmentNumber: formData.enrollmentNumber,
        branch: formData.branch,
        cgpa: Number(formData.cgpa),
        graduationYear: Number(formData.graduationYear),
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campus-register-page">

      <div className="campus-register-container">

        {/* LEFT BRANDING PANEL */}
        <aside className="campus-register-sidebar">

          <div className="campus-brand">
            <div className="campus-brand-logo">
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <div>
              <h3>CampusConnect</h3>
              <span>PLACEMENT PORTAL</span>
            </div>
          </div>

          <div className="campus-welcome">
            <span className="campus-eyebrow">
              YOUR CAREER STARTS HERE
            </span>

            <h1>
              Turn Your
              <br />
              <span>Dreams</span> Into
              <br />
              Opportunities.
            </h1>

            <p>
              Connect with top recruiters, discover exciting
              opportunities and take the next step towards
              your dream career.
            </p>
          </div>

          <div className="campus-feature-list">

            <div className="campus-feature">
              <div className="campus-feature-icon">
                <i className="bi bi-briefcase-fill"></i>
              </div>
              <div>
                <h6>Top Placement Opportunities</h6>
                <p>Explore exciting career opportunities.</p>
              </div>
            </div>

            <div className="campus-feature">
              <div className="campus-feature-icon">
                <i className="bi bi-buildings-fill"></i>
              </div>
              <div>
                <h6>Connect With Companies</h6>
                <p>Get connected with leading recruiters.</p>
              </div>
            </div>

            <div className="campus-feature">
              <div className="campus-feature-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <h6>Build Your Career</h6>
                <p>Showcase your academic achievements.</p>
              </div>
            </div>

          </div>

          <div className="campus-sidebar-footer">
            <span>© 2026 CampusConnect</span>
            <span>Empowering Future Professionals</span>
          </div>

          <div className="campus-decoration campus-circle-one"></div>
          <div className="campus-decoration campus-circle-two"></div>

        </aside>

        {/* RIGHT REGISTRATION PANEL */}
        <main className="campus-register-main">

          <div className="campus-form-header">

            <div>
              <span className="campus-form-tag">
                STUDENT REGISTRATION
              </span>

              <h2>Create Your Account</h2>

              <p>
                Fill in your details and get ready for your
                placement journey.
              </p>
            </div>

            <div className="campus-user-icon">
              <i className="bi bi-person-plus-fill"></i>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* PERSONAL INFORMATION */}
            <div className="campus-form-section">

              <div className="campus-section-heading">
                <span className="campus-section-icon">
                  <i className="bi bi-person-vcard"></i>
                </span>

                <div>
                  <h5>Personal Information</h5>
                  <p>Your basic contact details</p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="campus-label">
                    Full Name <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="campus-label">
                    Phone Number <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-telephone"></i>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10 digit mobile number"
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="campus-label">
                    Email Address <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your college or personal email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ACADEMIC INFORMATION */}
            <div className="campus-form-section">

              <div className="campus-section-heading">
                <span className="campus-section-icon">
                  <i className="bi bi-mortarboard"></i>
                </span>

                <div>
                  <h5>Academic Information</h5>
                  <p>Your college and academic details</p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="campus-label">
                    Enrollment Number <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-card-text"></i>
                    <input
                      type="text"
                      name="enrollmentNumber"
                      placeholder="Enter enrollment number"
                      value={formData.enrollmentNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="campus-label">
                    Branch <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-diagram-3"></i>

                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="campus-label">
                    Current CGPA <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-award"></i>
                    <input
                      type="number"
                      name="cgpa"
                      placeholder="Example: 8.5"
                      min="0"
                      max="10"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="campus-label">
                    Graduation Year <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-calendar-event"></i>

                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select graduation year</option>

                      {Array.from({ length: 8 }, (_, i) => 2026 + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* ACCOUNT SECURITY */}
            <div className="campus-form-section">

              <div className="campus-section-heading">
                <span className="campus-section-icon">
                  <i className="bi bi-shield-lock"></i>
                </span>

                <div>
                  <h5>Account Security</h5>
                  <p>Keep your account safe and secure</p>
                </div>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="campus-label">
                    Password <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-lock"></i>
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 8 characters"
                      minLength="8"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="campus-label">
                    Confirm Password <span>*</span>
                  </label>

                  <div className="campus-input-wrapper">
                    <i className="bi bi-lock-fill"></i>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      minLength="8"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="campus-error-message" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="campus-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="campus-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Student Account
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>

          </form>

          <div className="campus-login-footer">
            Already have an account?
            <Link to="/login"> Login Now</Link>
          </div>

          <div className="campus-bottom-note">
            <i className="bi bi-shield-check"></i>
            Your information is protected and secure.
          </div>

        </main>

      </div>

    </div>
  );
}

export default Register;