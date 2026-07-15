import { useState, useEffect } from "react";
import API from "../../services/api";
import { useToast } from "../common/Toast";
import { useAuth } from "../../context/AuthContext";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/admin/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users list:", error);
        showToast("Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userRole, userName) => {
    if (userId === currentUser.id) {
      showToast("You cannot delete your own admin account!", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${userRole} "${userName}"? This will permanently remove their properties and bookings.`)) {
      return;
    }

    try {
      const response = await API.delete(`/admin/user/${userId}`);
      if (response.data.success) {
        showToast("User account deleted successfully", "success");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete user", "error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Manage Registered Users</h2>
      <p style={{ color: "var(--text-secondary)" }}>Audit all user accounts and system permissions.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h3>No users registered yet.</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Joined Date</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: "600" }}>{user.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.email}</div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        backgroundColor:
                          user.role === "admin"
                            ? "rgba(147,51,234,0.15)"
                            : user.role === "owner"
                            ? "rgba(6,182,212,0.15)"
                            : "rgba(255,255,255,0.06)",
                        color:
                          user.role === "admin"
                            ? "var(--color-primary-hover)"
                            : user.role === "owner"
                            ? "var(--color-secondary)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user._id !== currentUser.id ? (
                      <button
                        onClick={() => handleDeleteUser(user._id, user.role, user.name)}
                        className="btn btn-accent"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        Delete User
                      </button>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Logged In (You)</span>
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

export default AllUsers;
