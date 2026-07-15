import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "./Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify & reset
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/user/forgot-password", { email });
      if (response.data.success) {
        showToast("Reset code logged to server console! Please check.", "success");
        setStep(2);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send reset code",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/user/reset-password", {
        email,
        code,
        newPassword,
      });
      if (response.data.success) {
        showToast("Password updated successfully! Log in now.", "success");
        navigate("/login");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Password reset failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            {step === 1
              ? "Enter your email to request a reset code"
              : "Enter the code logged in the server console and your new password"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestCode}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Request Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reset Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: "var(--color-secondary)", fontWeight: "600" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
