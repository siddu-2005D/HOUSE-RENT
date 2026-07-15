import { useState, useEffect } from "react";
import API from "../../../services/api";
import { useToast } from "../../common/Toast";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchMyBookings = async () => {
    try {
      const response = await API.get("/booking/my-bookings");
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error loading renter bookings:", error);
      showToast("Failed to load your bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking stay?")) {
      return;
    }

    try {
      const response = await API.delete(`/booking/cancel/${bookingId}`);
      if (response.data.success) {
        showToast("Booking cancelled successfully", "success");
        // Remove from list
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to cancel booking", "error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">My Bookings</h2>
      <p style={{ color: "var(--text-secondary)" }}>Track active applications and approved stays.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", marginTop: "2rem" }}>
          <h3 style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>You haven't booked any houses yet.</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property Details</th>
                <th>Landlord</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div style={{ fontWeight: "600" }}>{booking.property?.title || "Deleted Property"}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{booking.property?.location}</div>
                  </td>
                  <td>
                    {booking.property?.owner ? (
                      <>
                        <div>{booking.property.owner.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{booking.property.owner.email}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Unknown Landlord</span>
                    )}
                  </td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td style={{ fontWeight: "700" }}>${booking.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        booking.status === "Confirmed"
                          ? "confirmed"
                          : booking.status === "Cancelled"
                          ? "cancelled"
                          : "pending"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status !== "Cancelled" ? (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-accent"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        Cancel Stay
                      </button>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
