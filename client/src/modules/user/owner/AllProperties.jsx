import { useState, useEffect } from "react";
import API from "../../../services/api";
import AllPropertiesCards from "../AllPropertiesCards";
import { useToast } from "../../common/Toast";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const { showToast } = useToast();

  const fetchMyProperties = async () => {
    try {
      const response = await API.get("/owner/my-properties");
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Error loading properties:", error);
      showToast("Failed to load your properties", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (property) => {
    if (!window.confirm(`Are you sure you want to delete "${property.title}"? This will cancel all bookings on it.`)) {
      return;
    }

    try {
      const response = await API.delete(`/owner/delete-property/${property._id}`);
      if (response.data.success) {
        showToast("Property deleted successfully", "success");
        setProperties((prev) => prev.filter((p) => p._id !== property._id));
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete property", "error");
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setEditFormData({
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
    });
    setEditImageFile(null);
    setEditImagePreview(property.image ? `http://localhost:8000${property.image}` : "");
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.title || !editFormData.description || !editFormData.location || !editFormData.price || !editFormData.bedrooms || !editFormData.bathrooms) {
      showToast("Please fill in all details", "error");
      return;
    }

    setUpdateLoading(true);
    const data = new FormData();
    data.append("title", editFormData.title);
    data.append("description", editFormData.description);
    data.append("location", editFormData.location);
    data.append("price", editFormData.price);
    data.append("bedrooms", editFormData.bedrooms);
    data.append("bathrooms", editFormData.bathrooms);
    if (editImageFile) {
      data.append("image", editImageFile);
    }

    try {
      const response = await API.put(`/owner/update-property/${editingProperty._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showToast("Property updated successfully", "success");
        setIsEditModalOpen(false);
        fetchMyProperties(); // Reload properties
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update property", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <h2 className="section-title">My Listed Properties</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderLeftColor: "var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      ) : (
        <>
          <AllPropertiesCards
            properties={properties}
            onAction={handleEditClick}
            actionLabel="Edit Listing"
            actionClass="btn-secondary"
          />
          
          {/* Display Delete Button alongside */}
          {properties.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              * To delete a listing, click "Edit Listing" and click delete, or use the quick action inside the edit screen.
            </div>
          )}
        </>
      )}

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "1.5rem" }}>Edit Property Details</h3>
            
            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label className="form-label">Property Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  required
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rent ($/mo)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    className="form-control"
                    value={editFormData.bedrooms}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    className="form-control"
                    value={editFormData.bathrooms}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                  style={{ padding: "0.5rem" }}
                />
                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    style={{ height: "100px", borderRadius: "var(--radius-sm)", marginTop: "0.75rem", display: "block" }}
                  />
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    handleDelete(editingProperty);
                  }}
                  disabled={updateLoading}
                >
                  Delete Property
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updateLoading}
                >
                  Close
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
