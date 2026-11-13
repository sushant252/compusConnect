
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      alert("CGPA must be between 0 and 10.");
      return;
    }

    // Temporary frontend demo.
    // Real registration will be connected to backend later.
    alert("Registration form submitted successfully!");

    console.log("Student Registration:", {
      ...formData,
      password: "[hidden]",
      confirmPassword: "[hidden]",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "650px" }}>

        {/* Brand */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="brand-icon">C</div>
          <div>
            <h4 className="fw-bold mb-0">CampusConnect</h4>
            <small className="text-muted">
              College Placement Portal
            </small>
          </div>
        </div>

        <h3 className="fw-bold mb-2">Create Student Account</h3>

        <p className="auth-subtitle mb-4">
          Register yourself to explore placement opportunities.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Personal Details */}
          <h6 className="fw-bold mb-3 text-primary">
            Personal Information
          </h6>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Full Name *
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Phone Number *
              </label>

              <input
                type="tel"
                className="form-control"
                name="phone"
                placeholder="10 digit mobile number"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address *
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter college or personal email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <hr className="my-4" />

          {/* Academic Details */}
          <h6 className="fw-bold mb-3 text-primary">
            Academic Information
          </h6>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Enrollment Number *
              </label>

              <input
                type="text"
                className="form-control"
                name="enrollmentNumber"
                placeholder="Enter enrollment number"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Branch *
              </label>

              <select
                className="form-select form-control"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Current CGPA *
              </label>

              <input
                type="number"
                className="form-control"
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

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Graduation Year *
              </label>

              <select
                className="form-select form-control"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
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

          <hr className="my-4" />

          {/* Account Security */}
          <h6 className="fw-bold mb-3 text-primary">
            Account Security
          </h6>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Password *
              </label>

              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Minimum 8 characters"
                minLength="8"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Confirm Password *
              </label>

              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Re-enter password"
                minLength="8"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
          >
            Create Account
          </button>

        </form>

        <div className="text-center mt-4">
          <span className="text-muted">
            Already have an account?{" "}
          </span>

          <Link to="/login" className="fw-semibold">
            Login
          </Link>
        </div>

        <p className="text-center text-muted small mt-4 mb-0">
          © 2026 CampusConnect. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Register;
