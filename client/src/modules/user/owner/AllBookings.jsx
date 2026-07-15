import { useState, useEffect } from "react";
import API from "../../../services/api";
import { useToast } from "../../common/Toast";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      const response = await API.get("/booking/owner");
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      showToast("Failed to fetch bookings list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await API.put(`/booking/status/${bookingId}`, { status: newStatus });
      if (response.data.success) {
        showToast(`Booking ${newStatus.toLowerCase()} successfully`, "success");
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update booking status", "error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Received Bookings</h2>
      <p style={{ color: "var(--text-secondary)" }}>Review reservations made on your properties.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", marginTop: "2rem" }}>
          <h3 style={{ color: "var(--text-secondary)" }}>You have not received any bookings yet.</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Renter</th>
                <th>Check In</th>
                <th>Check Out</th>
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
                    <div>{booking.user?.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{booking.user?.email}</div>
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
                    {booking.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleUpdateStatus(booking._id, "Confirmed")}
                          className="btn btn-primary"
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking._id, "Cancelled")}
                          className="btn btn-accent"
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                        >
                          Decline
                        </button>
                      </div>
                    ) : booking.status === "Confirmed" ? (
                      <button
                        onClick={() => handleUpdateStatus(booking._id, "Cancelled")}
                        className="btn btn-secondary"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No Actions</span>
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
