import { Link } from "react-router-dom";

function LostCard({ item, onDelete }) {
  const getStatusStyle = (status) => {
    if (status === "open") {
      return { backgroundColor: "#dcfce7", color: "#166534" };
    }
    if (status === "possible_match") {
      return { backgroundColor: "#ffedd5", color: "#c2410c" };
    }
    return { backgroundColor: "#e5e7eb", color: "#374151" };
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>{item.title}</h3>
        <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
          {item.status}
        </span>
      </div>

      <p style={styles.category}>{item.category}</p>
      <p style={styles.text}>
        <strong>Description:</strong> {item.description}
      </p>
      <p style={styles.text}>
        <strong>Lost Location:</strong> {item.lostLocation}
      </p>
      <p style={styles.text}>
        <strong>Date Lost:</strong>{" "}
        {new Date(item.dateLost).toLocaleDateString()}
      </p>

      <div style={styles.actions}>
        <Link to={`/lost-reports/${item._id}`} style={styles.viewButton}>
          View
        </Link>

        <Link to={`/lost-reports/edit/${item._id}`} style={styles.editButton}>
          Edit
        </Link>

        <button onClick={() => onDelete(item._id)} style={styles.deleteButton}>
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
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
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
  },
  category: {
    margin: "8px 0 12px 0",
    fontSize: "14px",
    color: "#f97316",
    fontWeight: "600",
  },
  text: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#374151",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
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
    fontWeight: "600",
  },
};

export default LostCard;