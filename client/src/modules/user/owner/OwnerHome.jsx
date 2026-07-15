import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const OwnerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const propRes = await API.get("/owner/my-properties");
        const bookingRes = await API.get("/booking/owner");
        
        const myProps = propRes.data.properties || [];
        const myBookings = bookingRes.data.bookings || [];
        const pending = myBookings.filter((b) => b.status === "Pending").length;

        setStats({
          totalProperties: myProps.length,
          totalBookings: myBookings.length,
          pendingBookings: pending,
        });
      } catch (err) {
        console.error("Error loading owner stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Owner Dashboard</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Welcome back, <strong style={{ color: "#fff" }}>{user?.name}</strong>. Manage your rental listings and reservations.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalProperties}</div>
              <div className="stat-label">Listed Properties</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Bookings Received</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "3px solid var(--color-primary)" }}>
              <div className="stat-value" style={{ color: "var(--color-primary-hover)" }}>{stats.pendingBookings}</div>
              <div className="stat-label">Pending Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--color-secondary)" }}>
                ${(stats.totalProperties * 1450).toLocaleString()}
              </div>
              <div className="stat-label">Est. Monthly Revenue</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: "2rem" }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1rem" }}>List a New Property</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Add a new flat, house, or apartment listing. Fill in specifications, pricing, upload high-resolution photos, and make it instantly discoverable for renters.
                </p>
              </div>
              <Link to="/owner/add-property" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Add Property
              </Link>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1rem" }}>Manage Bookings</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Review active reservations on your houses. Accept bookings from users, cancel reservations, or keep track of rental check-in and check-out durations.
                </p>
              </div>
              <Link to="/owner/bookings" className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
                View Bookings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerHome;
