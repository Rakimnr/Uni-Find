import { useEffect, useState } from "react";
import { getFoundItems, updateFoundItemStatus, deleteFoundItem } from "../../api/foundApi";

const AdminExpiredItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await getFoundItems();
      const expiredItems = (data.data || []).filter(
        (item) => item.status === "expired"
      );
      setItems(expiredItems);
    } catch (error) {
      alert("Failed to load expired items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleArchive = async (id) => {
    try {
      await updateFoundItemStatus(id, "archived");
      fetchItems();
    } catch (error) {
      alert("Failed to archive item");
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
      alert("Failed to delete item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <p style={styles.stateText}>Loading expired items...</p>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Expired Items</h1>
        <p style={styles.subText}>
          View and manage items that are no longer active.
        </p>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3 style={styles.emptyTitle}>No expired items</h3>
          <p style={styles.emptyText}>
            There are currently no items marked as expired.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <span style={styles.badge}>Expired</span>

                <img
                  src={
                    item.image
                      ? `http://localhost:5001${item.image}`
                      : "https://via.placeholder.com/300x180?text=Expired+Item"
                  }
                  alt={item.title || "Expired Item"}
                  style={styles.image}
                />
              </div>

              <div style={styles.content}>
                <h3 style={styles.title}>{item.title}</h3>
                <p style={styles.meta}>📂 {item.category}</p>
                <p style={styles.meta}>📍 {item.foundLocation}</p>
                <p style={styles.meta}>🗓 {formatDate(item.dateFound)}</p>
                <p style={styles.meta}>📦 {item.storageLocation}</p>

                <div style={styles.actions}>
                  <button
                    style={styles.archiveButton}
                    onClick={() => handleArchive(item._id)}
                  >
                    Archive Item
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(item._id, item.title)}
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subText: {
    margin: 0,
    fontSize: "15px",
    color: "#6b7280",
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
  badge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 1,
    backgroundColor: "#fee2e2",
    color: "#991b1b",
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
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },
  archiveButton: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  deleteButton: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "32px",
    maxWidth: "500px",
  },
  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#111827",
  },
  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
  },
  stateText: {
    fontSize: "18px",
    color: "#6b7280",
    padding: "30px 0",
  },
};

export default AdminExpiredItemsPage;