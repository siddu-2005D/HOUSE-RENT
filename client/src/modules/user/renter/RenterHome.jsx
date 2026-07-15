import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const RenterHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/booking/my-bookings");
        const list = response.data.bookings || [];
        
        setStats({
          totalBookings: list.length,
          confirmedBookings: list.filter((b) => b.status === "Confirmed").length,
          pendingBookings: list.filter((b) => b.status === "Pending").length,
        });
      } catch (err) {
        console.error("Error loading renter stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Renter Dashboard</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Welcome back, <strong style={{ color: "#fff" }}>{user?.name}</strong>. Find your next house and track your booking applications.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="stat-card">
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Stays Applied</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "3px solid var(--color-secondary)" }}>
              <div className="stat-value" style={{ color: "var(--color-secondary)" }}>{stats.confirmedBookings}</div>
              <div className="stat-label">Approved Bookings</div>
            </div>
            <div className="stat-card" style={{ borderLeft: "3px solid var(--color-primary)" }}>
              <div className="stat-value" style={{ color: "var(--color-primary-hover)" }}>{stats.pendingBookings}</div>
              <div className="stat-label">Awaiting Confirmation</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: "2rem" }}>
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1rem" }}>Explore Properties</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Search for rental houses. Filter properties by location, maximum budget, and bedrooms/bathrooms specifications. Find and schedule stays instantly.
                </p>
              </div>
              <Link to="/renter/properties" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Browse Listings
              </Link>
            </div>

            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1rem" }}>My Bookings</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  Track active bookings, view landlord details, download summaries, or cancel a stay application before check-in.
                </p>
              </div>
              <Link to="/renter/bookings" className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
                My Applications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RenterHome;
