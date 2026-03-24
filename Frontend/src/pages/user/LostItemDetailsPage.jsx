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
      <div style={styles.wrapper}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.badgeTop}>Lost Item Portal</p>
            <h1 style={styles.heading}>Lost Item Details</h1>
            <p style={styles.subText}>
              View the full details of your lost item report.
            </p>
          </div>

          <div style={styles.topButtons}>
            <Link to="/" style={styles.secondaryButton}>
              Home
            </Link>
            <Link to="/lost-reports" style={styles.backButton}>
              Back to Reports
            </Link>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.headerRow}>
            <div>
              <h2 style={styles.title}>{item.title || "Untitled Item"}</h2>
              <p style={styles.category}>{item.category || "Uncategorized"}</p>
            </div>

            <span
              style={{
                ...styles.statusBadge,
                ...getStatusStyle(item.status),
              }}
            >
              {formatStatus(item.status)}
            </span>
          </div>

          {item.image && (
            <div style={styles.imageWrapper}>
              <img
                src={`http://localhost:5001${item.image}`}
                alt={item.title}
                style={styles.image}
              />
            </div>
          )}

          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <p style={styles.label}>Description</p>
              <p style={styles.value}>{item.description || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Lost Location</p>
              <p style={styles.value}>{item.lostLocation || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Date Lost</p>
              <p style={styles.value}>{formatDate(item.dateLost)}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Unique Features</p>
              <p style={styles.value}>{item.uniqueFeatures || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Contact Name</p>
              <p style={styles.value}>{item.contactName || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Contact Email</p>
              <p style={styles.value}>{item.contactEmail || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Contact Phone</p>
              <p style={styles.value}>{item.contactPhone || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.label}>Report Status</p>
              <p style={styles.value}>{formatStatus(item.status)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f9fafb 100%)",
    padding: "32px 20px",
    boxSizing: "border-box",
  },
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  topBar: {
    backgroundColor: "#ffffff",
    border: "1px solid #eef2f7",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  badgeTop: {
    display: "inline-block",
    margin: "0 0 10px 0",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    fontSize: "12px",
    fontWeight: "700",
  },
  heading: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    color: "#111827",
  },
  subText: {
    margin: "10px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
  },
  topButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  backButton: {
    textDecoration: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#111827",
  },
  category: {
    margin: 0,
    fontSize: "15px",
    color: "#f97316",
    fontWeight: "700",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  imageWrapper: {
    marginBottom: "24px",
  },
  image: {
    width: "240px",
    height: "240px",
    objectFit: "cover",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    display: "block",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  infoBox: {
    backgroundColor: "#f9fafb",
    border: "1px solid #eef2f7",
    borderRadius: "16px",
    padding: "16px",
  },
  label: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  value: {
    margin: 0,
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
    wordBreak: "break-word",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default LostItemDetailsPage;