import { Link } from "react-router-dom";

function LostCard({ item, onDelete }) {
  const getStatusStyle = (status) => {
    if (status === "open") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "possible_match") {
      return {
        backgroundColor: "#ffedd5",
        color: "#c2410c",
      };
    }

    return {
      backgroundColor: "#e5e7eb",
      color: "#374151",
    };
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString();
  };

  const handleDeleteClick = () => {
    if (typeof onDelete === "function") {
      onDelete(item?._id);
    }
  };

  return (
    <div style={styles.card}>
      {item?.image && (
        <div style={styles.imageWrapper}>
          <img
            src={`http://localhost:5001${item.image}`}
            alt={item?.title || "Lost item"}
            style={styles.image}
          />
        </div>
      )}

      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.title}>{item?.title || "Untitled Item"}</h3>
          <p style={styles.category}>{item?.category || "Uncategorized"}</p>
        </div>

        <span
          style={{
            ...styles.badge,
            ...getStatusStyle(item?.status),
          }}
        >
          {formatStatus(item?.status)}
        </span>
      </div>

      <p style={styles.text}>
        <strong>Description:</strong> {item?.description || "N/A"}
      </p>

      <p style={styles.text}>
        <strong>Lost Location:</strong> {item?.lostLocation || "N/A"}
      </p>

      <p style={styles.text}>
        <strong>Date Lost:</strong> {formatDate(item?.dateLost)}
      </p>

      <div style={styles.actions}>
        <Link to={`/lost-reports/${item?._id}`} style={styles.viewButton}>
          View
        </Link>

        <Link to={`/lost-reports/edit/${item?._id}`} style={styles.editButton}>
          Edit
        </Link>

        <button
          type="button"
          onClick={handleDeleteClick}
          style={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  imageWrapper: {
    marginBottom: "16px",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    display: "block",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "6px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  category: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#f97316",
    fontWeight: "600",
  },
  text: {
    margin: "10px 0",
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  viewButton: {
    textDecoration: "none",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: "600",
  },
  editButton: {
    textDecoration: "none",
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: "600",
  },
  deleteButton: {
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "1000",
  },
};

export default LostCard;