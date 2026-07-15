import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { useToast } from "../../common/Toast";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.description || !formData.location || !formData.price || !formData.bedrooms || !formData.bathrooms) {
      showToast("Please fill in all property details", "error");
      return;
    }

    if (Number(formData.price) <= 0 || Number(formData.bedrooms) <= 0 || Number(formData.bathrooms) <= 0) {
      showToast("Price, Bedrooms and Bathrooms must be positive values", "error");
      return;
    }

    setLoading(true);

    // Prepare FormData
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("price", formData.price);
    data.append("bedrooms", formData.bedrooms);
    data.append("bathrooms", formData.bathrooms);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const response = await API.post("/owner/add-property", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showToast("Property listing created successfully!", "success");
        navigate("/owner/properties");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create property listing. Try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h2 className="section-title">Add New Property Listing</h2>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Property Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Modern Glass Villa with Ocean View"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                placeholder="Provide a detailed description of the property, amenities, surrounding area, etc."
                value={formData.description}
                onChange={handleChange}
                required
                style={{ resize: "vertical" }}
              ></textarea>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Location / Address</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Beverly Hills, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Rent ($)</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="e.g. 2500"
                  value={formData.price}
                  onChange={handleChange}
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
                  placeholder="e.g. 3"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-control"
                  placeholder="e.g. 2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label className="form-label">Property Image</label>
              <div
                style={{
                  border: "2px dashed var(--border-glass)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  background: "rgba(0,0,0,0.15)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "var(--transition-fast)"
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
                onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-glass)"}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer"
                  }}
                />
                
                {imagePreview ? (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}
                    />
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Click or drag to change image</p>
                  </div>
                ) : (
                  <div>
                    <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p style={{ fontWeight: "600" }}>Upload property photo</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Supports JPG, PNG, WEBP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? "Publishing..." : "Publish Listing"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/owner")}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
