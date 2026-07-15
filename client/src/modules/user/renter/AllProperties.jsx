import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import AllPropertiesCards from "../AllPropertiesCards";
import { useToast } from "../../common/Toast";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchLoc, setSearchLoc] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");

  // Booking Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get("/user/properties");
        setProperties(response.data);
      } catch (err) {
        console.error("Error loading properties:", err);
        showToast("Failed to load property listings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleBookClick = (property) => {
    setSelectedProperty(property);
    setCheckIn("");
    setCheckOut("");
    setTotalAmount(0);
    setIsModalOpen(true);
  };

  // Recalculate rent amount based on checkIn and checkOut dates
  useEffect(() => {
    if (checkIn && checkOut && selectedProperty) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (end > start) {
        // Price is monthly in Property schema, let's treat it as monthly rent.
        // Daily rent = monthly / 30.
        const dailyRate = selectedProperty.price / 30;
        const calculated = Math.round(diffDays * dailyRate);
        setTotalAmount(calculated);
      } else {
        setTotalAmount(0);
      }
    }
  }, [checkIn, checkOut, selectedProperty]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      showToast("Please select check-in and check-out dates", "error");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) {
      showToast("Check-out date must be after check-in date", "error");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await API.post("/booking/create", {
        property: selectedProperty._id,
        checkIn,
        checkOut,
        totalAmount,
      });

      if (response.data.success) {
        showToast("Booking request sent to owner successfully!", "success");
        setIsModalOpen(false);
        navigate("/renter/bookings");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create booking",
        "error"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Filter listings
  const filtered = properties.filter((p) => {
    const matchLoc = p.location.toLowerCase().includes(searchLoc.toLowerCase());
    const matchPrice = maxPrice ? p.price <= Number(maxPrice) : true;
    const matchBeds = minBeds ? p.bedrooms >= Number(minBeds) : true;
    return matchLoc && matchPrice && matchBeds;
  });

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Rent a House</h2>
      <p style={{ color: "var(--text-secondary)" }}>Browse listed properties, customize details, and book your stay.</p>

      {/* Filters */}
      <div className="search-filter-bar" style={{ marginTop: "1.5rem" }}>
        <div className="filter-item">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by city/address"
            value={searchLoc}
            onChange={(e) => setSearchLoc(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label className="form-label">Max Price ($/mo)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 2000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label className="form-label">Min Bedrooms</label>
          <select
            className="form-control"
            value={minBeds}
            onChange={(e) => setMinBeds(e.target.value)}
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : (
        <AllPropertiesCards
          properties={filtered}
          onAction={handleBookClick}
          actionLabel="Book Stay"
        />
      )}

      {/* Booking Modal Overlay */}
      {isModalOpen && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 style={{ fontSize: "1.45rem", fontWeight: "700", marginBottom: "0.25rem" }}>Book Your Stay</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              {selectedProperty.title} - <strong>${selectedProperty.price}/month</strong>
            </p>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label className="form-label">Check-In Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-Out Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>

              {totalAmount > 0 && (
                <div
                  style={{
                    background: "rgba(147, 51, 234, 0.08)",
                    border: "1px solid var(--border-glass-glow)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block" }}>Calculated Cost</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--color-secondary)" }}>
                    ${totalAmount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginTop: "0.25rem" }}>
                    based on check-in duration
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={bookingLoading || totalAmount <= 0}
                >
                  {bookingLoading ? "Booking..." : "Confirm Book"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
