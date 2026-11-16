
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="auth-page">
      <div className="auth-card">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="brand-icon">C</div>
          <div>
            <h4 className="fw-bold mb-0">CampusConnect</h4>
            <small className="text-muted">
              College Placement Portal
            </small>
          </div>
        </div>

        <h3 className="fw-bold mb-2">Welcome Back!</h3>
        <p className="auth-subtitle mb-4">
          Login to continue to your placement dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Login As
            </label>

            <select
              className="form-select form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">
            Don't have an account?{" "}
          </span>

          <Link to="/register" className="fw-semibold">
            Register
          </Link>
        </div>

        <p className="text-center text-muted small mt-4 mb-0">
          © 2026 CampusConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
