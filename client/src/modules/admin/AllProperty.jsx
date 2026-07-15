import { useState, useEffect } from "react";
import API from "../../services/api";
import { useToast } from "../common/Toast";

const AllProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProperties = async () => {
    try {
      const response = await API.get("/admin/properties");
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error loading properties in admin:", error);
      showToast("Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId, title) => {
    if (!window.confirm(`Are you sure you want to delete listing "${title}"? This will also cancel all bookings on it.`)) {
      return;
    }

    try {
      const response = await API.delete(`/admin/property/${propertyId}`);
      if (response.data.success) {
        showToast("Property listing deleted successfully", "success");
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete property", "error");
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">Manage Property Listings</h2>
      <p style={{ color: "var(--text-secondary)" }}>Review and moderate all property listings posted on HouseHunt.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h3>No properties listed on the platform yet.</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Landlord</th>
                <th>Price</th>
                <th>Beds/Baths</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {property.image && (
                        <img
                          src={`http://localhost:8000${property.image}`}
                          alt={property.title}
                          style={{ width: "50px", height: "50px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=80";
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: "600" }}>{property.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{property.location}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {property.owner ? (
                      <>
                        <div>{property.owner.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{property.owner.email}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Deleted Owner</span>
                    )}
                  </td>
                  <td style={{ fontWeight: "700" }}>${property.price}/mo</td>
                  <td>{property.bedrooms}B / {property.bathrooms}Ba</td>
                  <td>
                    <button
                      onClick={() => handleDeleteProperty(property._id, property.title)}
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

export default AllProperty;
