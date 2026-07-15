import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const usersRes = await API.get("/admin/users");
        const propsRes = await API.get("/admin/properties");
        const bookingsRes = await API.get("/admin/bookings");

        setStats({
          users: usersRes.data.length || 0,
          properties: propsRes.data.length || 0,
          bookings: bookingsRes.data.length || 0,
        });
      } catch (err) {
        console.error("Error fetching admin metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Platform Admin Dashboard</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>
        System administrator view: <strong style={{ color: "#fff" }}>{user?.name}</strong>. Access controls and manage listings.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="stat-card">
              <div className="stat-value">{stats.users}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.properties}</div>
              <div className="stat-label">Listed Properties</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "3px solid var(--color-secondary)" }}>
              <div className="stat-value" style={{ color: "var(--color-secondary)" }}>{stats.bookings}</div>
              <div className="stat-label">Bookings Completed</div>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: "3rem" }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.75rem" }}>Manage Users</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                  Monitor and audit platform accounts. Delete violating accounts or view role mappings (Admin, Owner, Renter).
                </p>
              </div>
              <Link to="/admin/users" className="btn btn-primary" style={{ width: "100%" }}>
                Go to Users
              </Link>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.75rem" }}>Manage Listings</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                  Audit properties posted by land owners. Delete invalid listings, wrong pricing, or policy-violating property photos.
                </p>
              </div>
              <Link to="/admin/properties" className="btn btn-primary" style={{ width: "100%" }}>
                Go to Properties
              </Link>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.75rem" }}>Manage Bookings</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                  Track transactions and bookings made on the platform. Analyze pending and cancelled bookings list.
                </p>
              </div>
              <Link to="/admin/bookings" className="btn btn-primary" style={{ width: "100%" }}>
                Go to Bookings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
