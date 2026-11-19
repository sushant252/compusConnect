import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(
        formData.email,
        formData.password
      );

      if (loggedInUser.role !== formData.role) {
        setError(
          `This account does not have ${formData.role} access.`
        );
        return;
      }

      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campus-login-page">

      <div className="campus-login-container">

        {/* LEFT BRANDING PANEL */}
        <aside className="campus-login-sidebar">

          <div className="campus-login-brand">
            <div className="campus-login-brand-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <div>
              <h3>CampusConnect</h3>
              <span>PLACEMENT PORTAL</span>
            </div>
          </div>

          <div className="campus-login-welcome">
            <span className="campus-login-eyebrow">
              WELCOME TO YOUR FUTURE
            </span>

            <h1>
              Your Career.
              <br />
              Your <span>Journey.</span>
              <br />
              Your Success.
            </h1>

            <p>
              One platform to connect students, administrators
              and opportunities. Sign in and take the next
              step towards success.
            </p>
          </div>

          <div className="campus-login-highlights">

            <div>
              <i className="bi bi-briefcase-fill"></i>
              <span>Discover Placement Opportunities</span>
            </div>

            <div>
              <i className="bi bi-buildings-fill"></i>
              <span>Connect With Top Companies</span>
            </div>

            <div>
              <i className="bi bi-shield-check"></i>
              <span>Secure Account Access</span>
            </div>

          </div>

          <div className="campus-login-sidebar-footer">
            © 2026 CampusConnect. Empowering Future Professionals.
          </div>

          <div className="campus-login-circle circle-one"></div>
          <div className="campus-login-circle circle-two"></div>

        </aside>

        {/* RIGHT LOGIN PANEL */}
        <main className="campus-login-main">

          <div className="campus-login-content">

            <div className="campus-login-header">

              <div>
                <span className="campus-login-tag">
                  ACCOUNT LOGIN
                </span>

                <h2>Welcome Back!</h2>

                <p>
                  Login to continue to your placement dashboard.
                </p>
              </div>

              <div className="campus-login-user-icon">
                <i className="bi bi-person-lock"></i>
              </div>

            </div>

            <form onSubmit={handleSubmit}>

              {/* ROLE SELECTION */}
              <div className="campus-role-section">

                <label className="campus-login-label">
                  Select Your Account Type
                </label>

                <div className="campus-role-options">

                  {/* STUDENT */}
                  <label
                    className={`campus-role-card student-role ${
                      formData.role === "student" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === "student"}
                      onChange={() => handleRoleChange("student")}
                    />

                    <div className="campus-role-icon">
                      <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div className="campus-role-info">
                      <h5>Student</h5>
                      <p>Access your placement portal</p>
                    </div>

                    <span className="campus-role-check">
                      <i className="bi bi-check-lg"></i>
                    </span>

                  </label>

                  {/* ADMIN */}
                  <label
                    className={`campus-role-card admin-role ${
                      formData.role === "admin" ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={() => handleRoleChange("admin")}
                    />

                    <div className="campus-role-icon">
                      <i className="bi bi-person-badge-fill"></i>
                    </div>

                    <div className="campus-role-info">
                      <h5>Admin</h5>
                      <p>Manage placement activities</p>
                    </div>

                    <span className="campus-role-check">
                      <i className="bi bi-check-lg"></i>
                    </span>

                  </label>

                </div>
              </div>

              {/* EMAIL */}
              <div className="campus-login-field">

                <label className="campus-login-label">
                  Email Address
                </label>

                <div className="campus-login-input">
                  <i className="bi bi-envelope"></i>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* PASSWORD */}
              <div className="campus-login-field">

                <label className="campus-login-label">
                  Password
                </label>

                <div className="campus-login-input">
                  <i className="bi bi-lock"></i>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="campus-login-error" role="alert">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="campus-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="campus-login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

            </form>

            <div className="campus-login-register">
              Don't have an account?
              <Link to="/register"> Create Account</Link>
            </div>

            <div className="campus-login-security">
              <i className="bi bi-shield-lock-fill"></i>
              Your account is protected with secure authentication.
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Login;