import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLostItemById } from "../../api/lostApi.js";

function LostItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await getLostItemById(id);
        setItem(result.data);
      } catch {
        setError("Failed to load lost item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <div style={styles.stateText}>Loading item details...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  if (!item) {
    return <div style={styles.stateText}>Item not found.</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Lost Item Details</h1>
          <p style={styles.subText}>View complete lost report information.</p>
        </div>

        <Link to="/lost-reports" style={styles.backButton}>
          Back to Reports
        </Link>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.row}><strong>Category:</strong> {item.category}</p>
        <p style={styles.row}><strong>Description:</strong> {item.description}</p>
        <p style={styles.row}><strong>Lost Location:</strong> {item.lostLocation}</p>
        <p style={styles.row}>
          <strong>Date Lost:</strong> {new Date(item.dateLost).toLocaleDateString()}
        </p>
        <p style={styles.row}><strong>Unique Features:</strong> {item.uniqueFeatures || "N/A"}</p>
        <p style={styles.row}><strong>Contact Name:</strong> {item.contactName}</p>
        <p style={styles.row}><strong>Contact Email:</strong> {item.contactEmail}</p>
        <p style={styles.row}><strong>Contact Phone:</strong> {item.contactPhone || "N/A"}</p>
        <p style={styles.row}><strong>Status:</strong> {item.status}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "30px",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },
  subText: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
  },
  backButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    maxWidth: "800px",
  },
  title: {
    margin: "0 0 18px 0",
    fontSize: "28px",
    color: "#111827",
  },
  row: {
    fontSize: "15px",
    color: "#374151",
    margin: "10px 0",
    lineHeight: "1.6",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default LostItemDetailsPage;