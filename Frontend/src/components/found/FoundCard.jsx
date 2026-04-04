import { useNavigate } from "react-router-dom";

const FoundCard = ({ item }) => {
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    if (status === "available") return "IN STORAGE";
    if (status === "pending_verification") return "PROCESSING";
    if (status === "approved_for_return") return "READY TO RETURN";
    if (status === "returned") return "RETURNED";
    if (status === "expired") return "EXPIRED";
    if (status === "archived") return "ARCHIVED";
    return (status || "").toUpperCase().replaceAll("_", " ");
  };

  const getBadgeStyle = (status) => {
    if (status === "returned") {
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };
    }

    if (status === "pending_verification") {
      return {
        backgroundColor: "#facc15",
        color: "#78350f",
      };
    }

    if (status === "approved_for_return") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "expired" || status === "archived") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor: "#10b981",
      color: "#ffffff",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    if (typeof dateString === "string" && dateString.includes("/")) {
      return dateString;
    }

    return new Date(dateString).toLocaleDateString();
  };

  const imageSrc = item.image?.trim()
    ? `http://localhost:5001${item.image}`
    : "https://via.placeholder.com/300x180?text=Found+Item";

  const handleClaimClick = () => {
    if (item.status === "available") {
      navigate(`/claims/new/${item._id}`);
    }
  };

  const isClaimDisabled =
    item.status === "returned" ||
    item.status === "pending_verification" ||
    item.status === "approved_for_return" ||
    item.status === "expired" ||
    item.status === "archived";

  const getButtonText = () => {
    if (item.status === "returned") return "Already Returned";
    if (item.status === "pending_verification") return "Under Review";
    if (item.status === "approved_for_return") return "Ready for Return";
    if (item.status === "expired") return "Item Expired";
    if (item.status === "archived") return "Archived";
    return "Claim This Item";
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <span
          style={{
            ...styles.badge,
            ...getBadgeStyle(item.status),
          }}
        >
          {getStatusLabel(item.status)}
        </span>

        <img
          src={imageSrc}
          alt={item.title || "Found Item"}
          style={styles.image}
        />
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{item.title || "Untitled Item"}</h3>

        <p style={styles.meta}>📍 {item.foundLocation || "Unknown location"}</p>
        <p style={styles.meta}>🗓 {formatDate(item.dateFound)}</p>

        <button
          style={{
            ...styles.button,
            ...(isClaimDisabled ? styles.disabledButton : {}),
          }}
          onClick={handleClaimClick}
          disabled={isClaimDisabled}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "0.2s ease",
  },

  imageWrapper: {
    position: "relative",
    height: "180px",
    backgroundColor: "#ffffff", // ✅ clean white instead of gray
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px", // ✅ spacing around image
    borderBottom: "1px solid #f1f5f9", // subtle separation
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 10px",
    borderRadius: "999px",
    zIndex: 1,
  },

  content: {
    padding: "14px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#111827",
  },

  meta: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "6px",
  },

  button: {
    marginTop: "12px",
    width: "100%",
    backgroundColor: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "11px 12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    backgroundColor: "#d1d5db",
    color: "#4b5563",
    cursor: "not-allowed",
  },
};

export default FoundCard;