import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiEdit2,
  FiEye,
  FiMapPin,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { deleteLostItem, getMyLostItems } from "../../api/lostApi.js";

const MyLostReportsPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadMyLostItems = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyLostItems();
      setItems(result.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load your lost reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyLostItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lost report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteLostItem(id);

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to delete the lost report."
      );
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/600x400?text=Lost+Item";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `http://localhost:5001${imagePath}`;
  };

  const getStatusLabel = (status) => {
    if (status === "possible_match") return "Possible Match";
    if (status === "closed") return "Closed";
    return "Open";
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "possible_match") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "closed") {
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };
    }

    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  };

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    return ["All", ...uniqueCategories.filter(Boolean)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lostLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uniqueFeatures?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, searchTerm, selectedStatus, selectedCategory]);

  const totalReports = items.length;
  const openReports = items.filter((item) => item.status === "open").length;
  const possibleMatches = items.filter(
    (item) => item.status === "possible_match"
  ).length;
  const closedReports = items.filter((item) => item.status === "closed").length;

  return (
    <div style={styles.page}>
      <div style={styles.topSection}>
        <div>
          <p style={styles.kicker}>My Lost Reports</p>
          <h1 style={styles.heading}>Manage Your Lost Item Reports</h1>
          <p style={styles.subHeading}>
            Only your own lost reports are shown here. You can search, review,
            edit, or delete them anytime.
          </p>
        </div>

        <button
          type="button"
          style={styles.reportButton}
          onClick={() => navigate("/report-lost")}
        >
          <FiPlus size={18} />
          Report New Lost Item
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{totalReports}</h3>
          <p style={styles.statLabel}>Total Reports</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{openReports}</h3>
          <p style={styles.statLabel}>Open Reports</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{possibleMatches}</h3>
          <p style={styles.statLabel}>Possible Matches</p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{closedReports}</h3>
          <p style={styles.statLabel}>Closed Reports</p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <FiSearch size={18} color="#6b7280" />
          <input
            type="text"
            placeholder="Search your lost reports..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersWrap}>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            style={styles.select}
          >
            <option value="All">All Statuses</option>
            <option value="open">Open</option>
            <option value="possible_match">Possible Match</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            style={styles.select}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.stateCard}>Loading your lost reports...</div>
      ) : error ? (
        <div style={styles.errorCard}>{error}</div>
      ) : filteredItems.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>No lost reports found</h3>
          <p style={styles.emptyText}>
            You do not have any matching lost reports right now.
          </p>

          <div style={styles.emptyButtonRow}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("All");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>

            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => navigate("/report-lost")}
            >
              <FiPlus size={16} />
              Report Lost Item
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.imageWrap}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title || "Lost item"}
                  style={styles.image}
                />

                <span
                  style={{
                    ...styles.statusBadge,
                    ...getStatusBadgeStyle(item.status),
                  }}
                >
                  {getStatusLabel(item.status)}
                </span>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{item.title || "Untitled Item"}</h3>
                  <span style={styles.categoryTag}>
                    {item.category || "Other"}
                  </span>
                </div>

                <p style={styles.description}>
                  {item.description || "No description available."}
                </p>

                <div style={styles.metaList}>
                  <div style={styles.metaRow}>
                    <FiMapPin size={15} color="#f97316" />
                    <span style={styles.metaText}>
                      {item.lostLocation || "Unknown location"}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <FiCalendar size={15} color="#6b7280" />
                    <span style={styles.metaText}>
                      {formatDate(item.dateLost)}
                    </span>
                  </div>
                </div>

                {item.uniqueFeatures ? (
                  <div style={styles.featureBox}>
                    <strong style={styles.featureTitle}>Unique Features:</strong>
                    <p style={styles.featureText}>{item.uniqueFeatures}</p>
                  </div>
                ) : null}

                <div style={styles.actionRow}>
                  <button
                    type="button"
                    style={styles.viewButton}
                    onClick={() =>
                      navigate(`/lost-reports/${item._id}`, {
                        state: {
                          backTo: "/lost-reports",
                          backLabel: "Back to My Reports",
                          dashboardTo: "/dashboard",
                          dashboardLabel: "Dashboard",
                        },
                      })
                    }
                  >
                    <FiEye size={16} />
                    View
                  </button>

                  <button
                    type="button"
                    style={styles.editButton}
                    onClick={() => navigate(`/lost-reports/edit/${item._id}`)}
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    style={{
                      ...styles.deleteButton,
                      opacity: deletingId === item._id ? 0.7 : 1,
                    }}
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    <FiTrash2 size={16} />
                    {deletingId === item._id ? "Deleting..." : "Delete"}
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
  page: {
    minHeight: "100%",
  },

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  kicker: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  heading: {
    margin: "0 0 10px 0",
    fontSize: "34px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: 1.1,
  },

  subHeading: {
    margin: 0,
    maxWidth: "720px",
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: 1.7,
  },

  reportButton: {
    border: "none",
    borderRadius: "14px",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "14px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 8px 18px rgba(249, 115, 22, 0.20)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "22px 20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  },

  statNumber: {
    margin: "0 0 8px 0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#f97316",
    lineHeight: 1,
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "0 14px",
    minHeight: "48px",
    minWidth: "300px",
    flex: "1 1 320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#111827",
  },

  filtersWrap: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  select: {
    minWidth: "170px",
    minHeight: "48px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "0 14px",
    fontSize: "14px",
    color: "#374151",
    outline: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },

  imageWrap: {
    position: "relative",
    height: "220px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #f1f5f9",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  statusBadge: {
    position: "absolute",
    top: "14px",
    left: "14px",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  cardBody: {
    padding: "18px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: 1.3,
  },

  categoryTag: {
    flexShrink: 0,
    backgroundColor: "#fff7ed",
    color: "#f97316",
    border: "1px solid #fdba74",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  description: {
    margin: "0 0 14px 0",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.7,
    minHeight: "48px",
  },

  metaList: {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  metaText: {
    fontSize: "14px",
    color: "#4b5563",
  },

  featureBox: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "16px",
  },

  featureTitle: {
    display: "block",
    fontSize: "13px",
    color: "#111827",
    marginBottom: "6px",
  },

  featureText: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.6,
  },

  actionRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },

  viewButton: {
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "11px 12px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  editButton: {
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#fff7ed",
    color: "#f97316",
    padding: "11px 12px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  deleteButton: {
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "11px 12px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  stateCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "40px",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "16px",
    textAlign: "center",
  },

  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "15px",
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "48px 24px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  },

  emptyTitle: {
    margin: "0 0 10px 0",
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    margin: "0 0 20px 0",
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: 1.7,
  },

  emptyButtonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  secondaryButton: {
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default MyLostReportsPage;