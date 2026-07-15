import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./modules/common/Toast";

// Import modules
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";

// Owner
import OwnerHome from "./modules/user/owner/OwnerHome";
import AddProperty from "./modules/user/owner/AddProperty";
import OwnerProperties from "./modules/user/owner/AllProperties";
import OwnerBookings from "./modules/user/owner/AllBookings";

// Renter
import RenterHome from "./modules/user/renter/RenterHome";
import RenterProperties from "./modules/user/renter/AllProperties";
import RenterBookings from "./modules/user/renter/AllBookings";

// Admin
import AdminHome from "./modules/admin/AdminHome";
import AdminUsers from "./modules/admin/AllUsers";
import AdminProperties from "./modules/admin/AllProperty";
import AdminBookings from "./modules/admin/AllBookings";

// Protected Route Guard Component
const RouteGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles to their respective homes
    const fallbackPath =
      user.role === "admin" ? "/admin" : user.role === "owner" ? "/owner" : "/renter";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

// Navigation bar that changes based on auth state
const NavigationBar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast("Successfully logged out", "success");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="app-nav">
      <div className="container nav-container">
        <Link to="/" className="logo-link">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: "2.5" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>HouseHunt</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>

          {!user ? (
            <>
              <Link to="/login" className={`nav-item ${isActive("/login") ? "active" : ""}`}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Renter Nav links */}
              {user.role === "user" && (
                <>
                  <Link to="/renter" className={`nav-item ${isActive("/renter") ? "active" : ""}`}>
                    Dashboard
                  </Link>
                  <Link to="/renter/properties" className={`nav-item ${isActive("/renter/properties") ? "active" : ""}`}>
                    Find Houses
                  </Link>
                  <Link to="/renter/bookings" className={`nav-item ${isActive("/renter/bookings") ? "active" : ""}`}>
                    My Bookings
                  </Link>
                </>
              )}

              {/* Owner Nav links */}
              {user.role === "owner" && (
                <>
                  <Link to="/owner" className={`nav-item ${isActive("/owner") ? "active" : ""}`}>
                    Dashboard
                  </Link>
                  <Link to="/owner/properties" className={`nav-item ${isActive("/owner/properties") ? "active" : ""}`}>
                    My Houses
                  </Link>
                  <Link to="/owner/bookings" className={`nav-item ${isActive("/owner/bookings") ? "active" : ""}`}>
                    Bookings Received
                  </Link>
                </>
              )}

              {/* Admin Nav links */}
              {user.role === "admin" && (
                <>
                  <Link to="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
                    Dashboard
                  </Link>
                  <Link to="/admin/users" className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}>
                    Users
                  </Link>
                  <Link to="/admin/properties" className={`nav-item ${isActive("/admin/properties") ? "active" : ""}`}>
                    Properties
                  </Link>
                  <Link to="/admin/bookings" className={`nav-item ${isActive("/admin/bookings") ? "active" : ""}`}>
                    Bookings
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", marginLeft: "0.5rem" }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <NavigationBar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Renter Routes (role = 'user') */}
            <Route
              path="/renter"
              element={
                <RouteGuard allowedRoles={["user"]}>
                  <RenterHome />
                </RouteGuard>
              }
            />
            <Route
              path="/renter/properties"
              element={
                <RouteGuard allowedRoles={["user"]}>
                  <RenterProperties />
                </RouteGuard>
              }
            />
            <Route
              path="/renter/bookings"
              element={
                <RouteGuard allowedRoles={["user"]}>
                  <RenterBookings />
                </RouteGuard>
              }
            />

            {/* Owner Routes (role = 'owner') */}
            <Route
              path="/owner"
              element={
                <RouteGuard allowedRoles={["owner"]}>
                  <OwnerHome />
                </RouteGuard>
              }
            />
            <Route
              path="/owner/add-property"
              element={
                <RouteGuard allowedRoles={["owner"]}>
                  <AddProperty />
                </RouteGuard>
              }
            />
            <Route
              path="/owner/properties"
              element={
                <RouteGuard allowedRoles={["owner"]}>
                  <OwnerProperties />
                </RouteGuard>
              }
            />
            <Route
              path="/owner/bookings"
              element={
                <RouteGuard allowedRoles={["owner"]}>
                  <OwnerBookings />
                </RouteGuard>
              }
            />

            {/* Admin Routes (role = 'admin') */}
            <Route
              path="/admin"
              element={
                <RouteGuard allowedRoles={["admin"]}>
                  <AdminHome />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RouteGuard allowedRoles={["admin"]}>
                  <AdminUsers />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <RouteGuard allowedRoles={["admin"]}>
                  <AdminProperties />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <RouteGuard allowedRoles={["admin"]}>
                  <AdminBookings />
                </RouteGuard>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
