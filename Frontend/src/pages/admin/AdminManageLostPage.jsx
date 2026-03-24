import { useEffect, useState } from "react";
import {
  getLostItems,
  updateLostItemStatus,
  deleteLostItem,
} from "../../api/lostApi.js";

function AdminManageLostPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await getLostItems();
      setItems(data.data || []);
    } catch {
      alert("Failed to load lost items.");
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
    } catch {
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
    } catch {
      alert("Failed to delete lost item.");
    }
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "open") {
      return { backgroundColor: "#dcfce7", color: "#166534" };
    }
    if (status === "possible_match") {
      return { backgroundColor: "#ffedd5", color: "#c2410c" };
    }
    return { backgroundColor: "#e5e7eb", color: "#374151" };
  };

  if (loading) {
    return <div style={styles.stateText}>Loading lost items...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Manage Lost Items</h1>
      <p style={styles.subText}>
        View, update, and remove lost item reports.
      </p>

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item._id} style={styles.card}>
            <div style={styles.topRow}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <span style={{ ...styles.badge, ...getStatusBadgeStyle(item.status) }}>
                {item.status}
              </span>
            </div>

            <p style={styles.text}><strong>Category:</strong> {item.category}</p>
            <p style={styles.text}><strong>Location:</strong> {item.lostLocation}</p>
            <p style={styles.text}>
              <strong>Date:</strong> {new Date(item.dateLost).toLocaleDateString()}
            </p>
            <p style={styles.text}><strong>Contact:</strong> {item.contactName}</p>

            <select
              defaultValue={item.status}
              onChange={(e) => handleStatusChange(item._id, e.target.value)}
              style={styles.select}
            >
              <option value="open">Open</option>
              <option value="possible_match">Possible Match</option>
              <option value="closed">Closed</option>
            </select>

            <button
              onClick={() => handleDelete(item._id, item.title)}
              style={styles.deleteButton}
            >
              Delete Item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f9fafb", padding: "30px" },
  heading: { margin: 0, fontSize: "32px", fontWeight: "800", color: "#111827" },
  subText: { margin: "8px 0 24px 0", color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "flex-start",
  },
  cardTitle: { margin: 0, fontSize: "20px", fontWeight: "700", color: "#111827" },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  text: { margin: "8px 0", fontSize: "14px", color: "#374151" },
  select: {
    width: "100%",
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
  },
  deleteButton: {
    marginTop: "12px",
    width: "100%",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  stateText: { padding: "40px", fontSize: "18px", color: "#6b7280" },
};

export default AdminManageLostPage;