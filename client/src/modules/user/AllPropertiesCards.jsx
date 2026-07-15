import { useAuth } from "../../context/AuthContext";

const AllPropertiesCards = ({ properties, onAction, actionLabel, actionClass = "btn-primary" }) => {
  const { user } = useAuth();
  const backendUrl = "http://localhost:8000";

  return (
    <div className="grid-3">
      {properties.length === 0 ? (
        <div style={{ gridColumn: "span 3", textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          <h3>No properties found matching your criteria.</h3>
        </div>
      ) : (
        properties.map((property) => {
          // Resolve image URL
          const imageUrl = property.image
            ? property.image.startsWith("http")
              ? property.image
              : `${backendUrl}${property.image}`
            : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"; // Premium Unsplash fallback image

          return (
            <div key={property._id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="property-card-img-wrapper">
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="property-card-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <span className="property-badge">Available</span>
              </div>

              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div className="property-price">
                  ${property.price.toLocaleString()}
                  <span>/month</span>
                </div>
                <h3 className="property-title" title={property.title}>{property.title}</h3>
                <p className="property-location">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "inline", verticalAlign: "middle" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {" "}{property.location}
                </p>
                
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem", flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {property.description}
                </p>

                <div className="property-specs">
                  <div className="property-spec-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="property-spec-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{property.bathrooms} Baths</span>
                  </div>
                </div>

                {onAction && actionLabel && (
                  <button
                    onClick={() => onAction(property)}
                    className={`btn ${actionClass}`}
                    style={{ width: "100%", marginTop: "1.25rem" }}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AllPropertiesCards;
