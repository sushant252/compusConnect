
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";

function AdminSettings() {
    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Fetch admin profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get("/admin/settings/profile");

                setProfile({
                    name: response.data.admin.name || "",
                    email: response.data.admin.email || ""
                });
            } catch (error) {
                setProfileError(
                    error.response?.data?.message ||
                    "Failed to load admin profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle profile input
    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    // Update admin profile
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        setProfileMessage("");
        setProfileError("");
        setSavingProfile(true);

        try {
            const response = await API.put(
                "/admin/settings/profile",
                profile
            );

            setProfile({
                name: response.data.admin.name,
                email: response.data.admin.email
            });

            setProfileMessage(
                response.data.message || "Profile updated successfully"
            );
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSavingProfile(false);
        }
    };

    // Handle password input
    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    // Change admin password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters"
            );
            return;
        }

        setSavingPassword(true);

        try {
            const response = await API.put(
                "/admin/settings/password",
                passwords
            );

            setPasswordMessage(
                response.data.message || "Password changed successfully"
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <AdminLayout
            title="Admin Settings"
            subtitle="Manage your account and security settings"
        >
            <div className="container-fluid py-3">

                {/* Page Heading */}
                <div className="mb-4">
                    <h4 className="fw-bold">Account Settings</h4>
                    <p className="text-muted">
                        Update your profile information and password.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />
                        <p className="mt-2 text-muted">
                            Loading settings...
                        </p>
                    </div>
                ) : (
                    <div className="row g-4">

                        {/* Profile Settings */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">

                                    <div className="mb-4">
                                        <h5 className="fw-bold">
                                            <i className="bi bi-person-circle me-2"></i>
                                            Profile Information
                                        </h5>
                                        <p className="text-muted small">
                                            Update your admin account details.
                                        </p>
                                    </div>

                                    {profileMessage && (
                                        <div className="alert alert-success">
                                            {profileMessage}
                                        </div>
                                    )}

                                    {profileError && (
                                        <div className="alert alert-danger">
                                            {profileError}
                                        </div>
                                    )}

                                    <form onSubmit={handleProfileSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={profile.name}
                                                onChange={handleProfileChange}
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={profile.email}
                                                onChange={handleProfileChange}
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={savingProfile}
                                        >
                                            {savingProfile
                                                ? "Saving..."
                                                : "Save Profile"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Password Settings */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">

                                    <div className="mb-4">
                                        <h5 className="fw-bold">
                                            <i className="bi bi-shield-lock me-2"></i>
                                            Change Password
                                        </h5>
                                        <p className="text-muted small">
                                            Keep your admin account secure.
                                        </p>
                                    </div>

                                    {passwordMessage && (
                                        <div className="alert alert-success">
                                            {passwordMessage}
                                        </div>
                                    )}

                                    {passwordError && (
                                        <div className="alert alert-danger">
                                            {passwordError}
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                className="form-control"
                                                value={passwords.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter current password"
                                                autoComplete="current-password"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                className="form-control"
                                                value={passwords.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Minimum 8 characters"
                                                minLength={8}
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control"
                                                value={passwords.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Re-enter new password"
                                                autoComplete="new-password"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={savingPassword}
                                        >
                                            {savingPassword
                                                ? "Updating..."
                                                : "Update Password"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminSettings;
