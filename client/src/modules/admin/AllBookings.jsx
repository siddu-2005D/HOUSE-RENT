import { useState, useEffect } from "react";
import API from "../../services/api";
import { useToast } from "../common/Toast";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await API.get("/admin/bookings");
        setBookings(response.data || []);
      } catch (error) {
        console.error("Error loading all bookings:", error);
        showToast("Failed to load platform bookings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking record? This cannot be undone.")) {
      return;
    }

    try {
      const response = await API.delete(`/admin/booking/${bookingId}`);
      if (response.data.success) {
        showToast("Booking record deleted successfully", "success");
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete booking record", "error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Manage Reservations</h2>
      <p style={{ color: "var(--text-secondary)" }}>Track and manage all bookings processed through HouseHunt.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h3>No bookings processed on the platform yet.</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Renter</th>
                <th>Landlord</th>
                <th>Dates</th>
                <th>Amount</th>
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
                    {booking.user ? (
                      <>
                        <div>{booking.user.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{booking.user.email}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Deleted Account</span>
                    )}
                  </td>
                  <td>
                    {booking.property?.owner ? (
                      <>
                        <div>Landlord ID: {booking.property.owner}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Unknown</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: "0.9rem" }}>In: {new Date(booking.checkIn).toLocaleDateString()}</div>
                    <div style={{ fontSize: "0.9rem" }}>Out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                  </td>
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
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="btn btn-accent"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                    >
                      Delete
                    </button>
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
