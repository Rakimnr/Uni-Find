import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiEye,
  FiFolder,
  FiMapPin,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import {
  getLostItems,
  updateLostItemStatus,
  deleteLostItem,
} from "../../api/lostApi.js";

const AdminManageLostPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    try {
      const result = await getLostItems();
      setItems(result?.data || []);
    } catch (error) {
      alert("Failed to load lost items");
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
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (error) {
      alert("Failed to update item status");
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title || "this lost item"}"?`
    );

    if (!confirmed) return;

    try {
      await deleteLostItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert("Failed to delete lost item");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    if (status === "open") return "Open";
    if (status === "possible_match") return "Possible Match";
    if (status === "closed") return "Closed";
    return status || "Unknown";
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "open") {
      return {
        backgroundColor: "#ffedd5",
        color: "#c2410c",
      };
    }

    if (status === "possible_match") {
      return {
        backgroundColor: "#fef3c7",
        color: "#a16207",
      };
    }

    if (status === "closed") {
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };
    }

    return {
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
    };
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.lostLocation?.toLowerCase().includes(query) ||
        item.contactName?.toLowerCase().includes(query) ||
        item.contactEmail?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.uniqueFeatures?.toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery]);

  if (loading) {
    return <p style={styles.stateText}>Loading lost items...</p>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Manage Lost Items</h1>
        <p style={styles.subText}>
          View, search, inspect, update, and remove lost items from the system.
        </p>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.searchInputWrap}>
          <span style={styles.searchIcon}>
            <FiSearch size={16} />
          </span>

          <input
            type="text"
            placeholder="Search by title, category, location, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {searchQuery && (
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => setSearchQuery("")}
          >
            <FiX size={16} />
            Clear
          </button>
        )}
      </div>

      <div style={styles.resultBar}>
        <p style={styles.resultText}>
          Showing <strong>{filteredItems.length}</strong> of{" "}
          <strong>{items.length}</strong> lost items
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyTitle}>No matching lost items found</p>
          <p style={styles.emptySubText}>
            Try another keyword for title, category, location, or owner.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
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

                {item.image ? (
                  <img
                    src={`http://localhost:5001${item.image}`}
                    alt={item.title || "Lost Item"}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.imagePlaceholder}>No Image</div>
                )}
              </div>

              <div style={styles.content}>
                <h3 style={styles.title}>{item.title || "Untitled Lost Item"}</h3>

                <div style={styles.metaList}>
                  <div style={styles.metaRow}>
                    <FiFolder size={15} style={styles.metaIcon} />
                    <span style={styles.metaText}>
                      {item.category || "Other"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <FiMapPin size={15} style={styles.metaIcon} />
                    <span style={styles.metaTextClamp}>
                      {item.lostLocation || "No location provided"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <FiCalendar size={15} style={styles.metaIcon} />
                    <span style={styles.metaText}>
                      {formatDate(item.dateLost)}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <FiUser size={15} style={styles.metaIcon} />
                    <span style={styles.metaText}>
                      {item.contactName || "Unknown owner"}
                    </span>
                  </div>
                </div>

                <div style={styles.statusSection}>
                  <label style={styles.label}>Update Status</label>

                  <select
                    value={item.status || "open"}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    style={styles.select}
                  >
                    <option value="open">Open</option>
                    <option value="possible_match">Possible Match</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div style={styles.buttonGroup}>
                  <Link
                    to={`/admin/lost-items/${item._id}`}
                    state={{
                      backTo: "/admin/lost-items",
                      backLabel: "Back to Manage Lost Items",
                      dashboardTo: "/admin",
                      dashboardLabel: "Admin Dashboard",
                    }}
                    style={styles.inspectButton}
                  >
                    <FiEye size={16} />
                    Inspect Record
                  </Link>

                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={() => handleDelete(item._id, item.title)}
                  >
                    <FiTrash2 size={16} />
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1200px) {
          .lost-admin-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .lost-admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  header: {
    marginBottom: "20px",
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

  searchSection: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  searchInputWrap: {
    position: "relative",
    flex: 1,
    minWidth: "260px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchInput: {
    width: "100%",
    padding: "13px 14px 13px 42px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  clearButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #fed7aa",
    backgroundColor: "#fff7ed",
    color: "#9a3412",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },

  resultBar: {
    marginBottom: "18px",
  },

  resultText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },

  imageWrapper: {
    position: "relative",
    height: "180px",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    boxSizing: "border-box",
    borderBottom: "1px solid #f1f5f9",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
  },

  statusBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 1,
  },

  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  title: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: "1.35",
    margin: "0 0 12px 0",
    minHeight: "44px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  metaList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  metaRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },

  metaIcon: {
    color: "#f59e0b",
    flexShrink: 0,
    marginTop: "2px",
  },

  metaText: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.45",
  },

  metaTextClamp: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.45",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "38px",
  },

  statusSection: {
    marginTop: "14px",
    marginBottom: "14px",
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
    padding: "11px 14px",
    borderRadius: "12px",
    border: "2px solid #fed7aa",
    backgroundColor: "#fff7ed",
    color: "#9a3412",
    fontSize: "14px",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
    marginTop: "4px",
  },

  inspectButton: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    textAlign: "center",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  deleteButton: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  emptyBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "40px 20px",
    textAlign: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },

  emptySubText: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },

  stateText: {
    fontSize: "18px",
    color: "#6b7280",
    padding: "30px 0",
  },
};

export default AdminManageLostPage;