import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "./Toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast("Please enter email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/user/login", formData);
      if (response.data.success) {
        const { user, token } = response.data;
        login(user, token);
        showToast(`Welcome back, ${user.name}!`, "success");
        
        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "owner") {
          navigate("/owner");
        } else {
          navigate("/renter");
        }
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Invalid credentials, please try again.",
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
          <h2>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)" }}>Sign in to continue your home hunt</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ color: "var(--color-secondary)", fontSize: "0.85rem" }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--color-secondary)", fontWeight: "600" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
