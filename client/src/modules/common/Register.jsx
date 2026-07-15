// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../../services/api";
// import { useToast } from "./Toast";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "user", // Default renter
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.password) {
//       showToast("Please fill in all fields", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await API.post("/user/register", formData);
//       if (response.data.success) {
//         showToast("Registration Successful! Please login.", "success");
//         navigate("/login");
//       } else {
//         showToast(response.data.message || "Registration failed", "error");
//       }
//     } catch (error) {
//       showToast(
//         error.response?.data?.message || "Registration failed. Try again.",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-wrapper container">
//       <div className="card auth-card">
//         <div className="auth-header">
//           <h2>Create Account</h2>
//           <p style={{ color: "var(--text-secondary)" }}>Join HouseHunt to find your next home</p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               className="form-control"
//               placeholder="John Doe"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               placeholder="john@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="form-control"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label">I want to register as a</label>
//             <select
//               name="role"
//               className="form-control"
//               value={formData.role}
//               onChange={handleChange}
//             >
//               <option value="user">Renter (looking for a house)</option>
//               <option value="owner">Owner (looking to rent out property)</option>
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             style={{ width: "100%", marginTop: "1rem" }}
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>
//         <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)" }}>
//           Already have an account?{" "}
//           <Link to="/login" style={{ color: "var(--color-secondary)", fontWeight: "600" }}>
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "./Toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default renter
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/user/register", formData);

      if (response.data.success) {
        showToast("Registration Successful! Please login.", "success");
        navigate("/login");
      } else {
        showToast(response.data.message || "Registration failed", "error");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration failed. Try again.",
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
          <h2>Create Account</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Join HouseHunt to find your next home
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label className="form-label">Password</label>
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

          <div className="form-group">
            <label className="form-label">I want to register as a</label>

            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">
                Renter (Looking for a House)
              </option>

              <option value="owner">
                Owner (Rent Out Property)
              </option>

              <option value="admin">
                Administrator
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--color-secondary)",
              fontWeight: "600",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;