import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import AllPropertiesCards from "../user/AllPropertiesCards";
import { useAuth } from "../../context/AuthContext";
import heroImg from "../../assets/hero.png";

const Home = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get("/user/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((prop) => {
    const matchesLocation = prop.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesPrice = filterPrice ? prop.price <= Number(filterPrice) : true;
    return matchesLocation && matchesPrice;
  });

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Dream Home</h1>
          <p className="hero-subtitle">
            HouseHunt connects renters directly with property owners. Explore premium spaces, schedule bookings, and secure your new home with zero hassle.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : user.role === "owner" ? "/owner" : "/renter"}
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image-container">
          <img src={heroImg} className="hero-img" alt="HouseHunt Hero Image" />
        </div>
      </section>

      {/* Listings Section */}
      <section style={{ marginTop: "2rem" }}>
        <h2 className="section-title">Explore Featured Listings</h2>
        
        {/* Search and Filters */}
        <div className="search-filter-bar">
          <div className="filter-item">
            <label className="form-label">Search Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. New York, Beverly Hills"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label className="form-label">Max Monthly Rent ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 3000"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading listings...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <AllPropertiesCards properties={filteredProperties} />
        )}
      </section>
    </div>
  );
};

export default Home;
