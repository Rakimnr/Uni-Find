import { useEffect, useState } from "react";
import {
  getFoundItems,
  updateFoundItemStatus,
  deleteFoundItem,
} from "../../api/foundApi";

const AdminManageFoundPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await getFoundItems();
      setItems(data.data || []);
    } catch (error) {
      alert("Failed to load found items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateFoundItemStatus(id, status);
      fetchItems();
    } catch (error) {
      alert("Failed to update item status");
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteFoundItem(id);
      fetchItems();
    } catch (error) {
      alert("Failed to delete found item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    if (status === "available") return "Available";
    if (status === "pending_verification") return "Pending Verification";
    if (status === "approved_for_return") return "Approved For Return";
    if (status === "returned") return "Returned";
    if (status === "expired") return "Expired";
    if (status === "archived") return "Archived";
    return status;
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "available") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "pending_verification") {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }

    if (status === "approved_for_return") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "returned") {
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };
    }

    if (status === "expired") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
    };
  };

  if (loading) {
    return <p style={styles.stateText}>Loading found items...</p>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Manage Found Items</h1>
        <p style={styles.subText}>
          View, update, and remove found items from the system.
        </p>
      </div>

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item._id} style={styles.card}>
            <div style={styles.imageWrapper}>
              <span
                style={{
                  ...styles.statusBadge,
                  ...getStatusBadgeStyle(item.status),
                }}
              >
                {getStatusLabel(item.status)}
              </span>

              <img
                src={
                  item.image
                    ? `http://localhost:5001${item.image}`
                    : "https://via.placeholder.com/300x180?text=Found+Item"
                }
                alt={item.title || "Found Item"}
                style={styles.image}
              />
            </div>

            <div style={styles.content}>
              <h3 style={styles.title}>{item.title}</h3>

              <p style={styles.meta}>📂 {item.category}</p>
              <p style={styles.meta}>📍 {item.foundLocation}</p>
              <p style={styles.meta}>🗓 {formatDate(item.dateFound)}</p>
              <p style={styles.meta}>📦 {item.storageLocation}</p>

              <div style={styles.statusSection}>
                <label style={styles.label}>Update Status</label>

                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(item._id, e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="available">Available</option>
                  <option value="pending_verification">
                    Pending Verification
                  </option>
                  <option value="approved_for_return">
                    Approved For Return
                  </option>
                  <option value="returned">Returned</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(item._id, item.title)}
              >
                Delete Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: "24px",
  },
  heading: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    marginBottom: "8px",
  },
  subText: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "22px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },
  imageWrapper: {
    position: "relative",
    height: "190px",
    backgroundColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  statusBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 1,
  },
  content: {
    padding: "18px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#111827",
  },
  meta: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  statusSection: {
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #f1f5f9",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    fontSize: "14px",
    color: "#374151",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "2px solid #fed7aa",
    backgroundColor: "#fff7ed",
    color: "#9a3412",
    fontSize: "14px",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop: "16px",
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  stateText: {
    fontSize: "18px",
    color: "#6b7280",
    padding: "30px 0",
  },
};

export default AdminManageFoundPage;