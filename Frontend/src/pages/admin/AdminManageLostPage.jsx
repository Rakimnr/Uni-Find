import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLostItems,
  updateLostItemStatus,
  deleteLostItem,
} from "../../api/lostApi.js";

function AdminManageLostPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      const result = await getLostItems();
      setItems(result.data || []);
    } catch (err) {
      setError("Failed to load lost items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateLostItemStatus(id, status);
      fetchItems();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteLostItem(id);
      fetchItems();
    } catch (err) {
      alert("Failed to delete lost item.");
    }
  };

  const getStatusBadgeStyle = (status) => {
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
    return <div style={styles.stateText}>Loading lost items...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <p style={styles.badgeTop}>Admin Panel</p>
          <h1 style={styles.heading}>Manage Lost Items</h1>
          <p style={styles.subText}>
            View, update, and remove lost item reports.
          </p>
        </div>

        <Link to="/" style={styles.backButton}>
          Back Home
        </Link>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>No lost items found.</div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item._id} style={styles.card}>
              {item.image && (
                <div style={styles.imageWrapper}>
                  <img
                    src={`http://localhost:5001${item.image}`}
                    alt={item.title || "Lost item"}
                    style={styles.image}
                  />
                </div>
              )}

              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.cardTitle}>{item.title || "Untitled Item"}</h3>
                  <p style={styles.category}>{item.category || "Uncategorized"}</p>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    ...getStatusBadgeStyle(item.status),
                  }}
                >
                  {formatStatus(item.status)}
                </span>
              </div>

              <p style={styles.text}>
                <strong>Location:</strong> {item.lostLocation || "N/A"}
              </p>

              <p style={styles.text}>
                <strong>Date:</strong> {formatDate(item.dateLost)}
              </p>

              <p style={styles.text}>
                <strong>Contact:</strong> {item.contactName || "N/A"}
              </p>

              <p style={styles.text}>
                <strong>Email:</strong> {item.contactEmail || "N/A"}
              </p>

              <p style={styles.text}>
                <strong>Description:</strong> {item.description || "N/A"}
              </p>

              <select
                value={item.status || "open"}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                style={styles.select}
              >
                <option value="open">Open</option>
                <option value="possible_match">Possible Match</option>
                <option value="closed">Closed</option>
              </select>

              <div style={styles.actions}>
                <Link
                  to={`/lost-reports/${item._id}`}
                  style={styles.viewButton}
                >
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item._id, item.title)}
                  style={styles.deleteButton}
                >
                  Delete Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
    backgroundColor: "#111827",
    color: "#ffffff",
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
  backButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
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
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "8px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  category: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#f97316",
    fontWeight: "600",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  text: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
  },
  select: {
    width: "100%",
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    fontSize: "14px",
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
  deleteButton: {
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default AdminManageLostPage;