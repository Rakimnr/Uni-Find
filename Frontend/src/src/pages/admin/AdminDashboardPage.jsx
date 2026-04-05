import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFoundItems } from "../../api/foundApi";
import { getAllClaims } from "../../api/claimApi";
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiClipboard,
  FiPackage,
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    returnedItems: 0,
    expiredItems: 0,
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  });

  const [recentItems, setRecentItems] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const itemsRes = await getFoundItems();
        const claimsRes = await getAllClaims();

        const items = itemsRes.data || [];
        const claims = claimsRes.claims || [];

        setStats({
          totalItems: items.length,
          availableItems: items.filter((item) => item.status === "available").length,
          returnedItems: items.filter((item) => item.status === "returned").length,
          expiredItems: items.filter((item) => item.status === "expired").length,
          totalClaims: claims.length,
          pendingClaims: claims.filter((claim) => claim.status === "pending").length,
          approvedClaims: claims.filter((claim) => claim.status === "approved").length,
          rejectedClaims: claims.filter((claim) => claim.status === "rejected").length,
        });

        setRecentItems(items.slice(0, 5));
        setRecentClaims(claims.slice(0, 5));
      } catch (error) {
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getItemStatusStyle = (status) => {
    switch (status) {
      case "available":
        return styles.badgeBlue;
      case "returned":
        return styles.badgeGreen;
      case "expired":
        return styles.badgeRed;
      case "pending_verification":
        return styles.badgeOrange;
      default:
        return styles.badgeGray;
    }
  };

  const getClaimStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return styles.badgeGreen;
      case "pending":
        return styles.badgeOrange;
      case "rejected":
        return styles.badgeRed;
      default:
        return styles.badgeGray;
    }
  };

  const formatStatusText = (status) => {
    if (!status) return "Unknown";
    return status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredRecentItems = recentItems.filter((item) =>
    item.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const statCards = [
    {
      label: "Total Found Items",
      value: stats.totalItems,
      icon: <FiPackage size={20} />,
      accent: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      label: "Available Items",
      value: stats.availableItems,
      icon: <FiPackage size={20} />,
      accent: "#ecfeff",
      iconColor: "#0891b2",
    },
    {
      label: "Returned Items",
      value: stats.returnedItems,
      icon: <FiCheckCircle size={20} />,
      accent: "#ecfdf5",
      iconColor: "#16a34a",
    },
    {
      label: "Expired Items",
      value: stats.expiredItems,
      icon: <FiArchive size={20} />,
      accent: "#fef2f2",
      iconColor: "#dc2626",
    },
    {
      label: "Total Claims",
      value: stats.totalClaims,
      icon: <FiClipboard size={20} />,
      accent: "#f8fafc",
      iconColor: "#475569",
    },
    {
      label: "Pending Claims",
      value: stats.pendingClaims,
      icon: <FiClock size={20} />,
      accent: "#fff7ed",
      iconColor: "#ea580c",
    },
    {
      label: "Approved Claims",
      value: stats.approvedClaims,
      icon: <FiCheckCircle size={20} />,
      accent: "#ecfdf5",
      iconColor: "#16a34a",
    },
    {
      label: "Rejected Claims",
      value: stats.rejectedClaims,
      icon: <FiXCircle size={20} />,
      accent: "#fef2f2",
      iconColor: "#dc2626",
    },
  ];

  if (loading) {
    return <p style={styles.stateText}>Loading dashboard...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Admin Dashboard</h1>
          <p style={styles.subText}>Manage found items and claim activity from one place.</p>
        </div>

        <div style={styles.topBarRight}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6b7280" />
            <input
              type="text"
              placeholder="Search recent items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button style={styles.iconButton}>
            <FiBell size={18} />
          </button>

          <div style={styles.profileBox}>
            <div style={styles.avatar}>A</div>
            <div>
              <p style={styles.profileName}>Admin</p>
              <p style={styles.profileRole}>UniFind Panel</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actionsRow}>
        <button
          style={styles.primaryAction}
          onClick={() => navigate("/admin/add-found-item")}
        >
          <FiPlus size={16} />
          Add Found Item
        </button>

        <button
          style={styles.secondaryAction}
          onClick={() => navigate("/admin/claims")}
        >
          <FiClipboard size={16} />
          Review Claims
        </button>

        <button
          style={styles.secondaryAction}
          onClick={() => navigate("/admin/found-items")}
        >
          <FiPackage size={16} />
          Manage Items
        </button>

        <button
          style={styles.secondaryAction}
          onClick={() => navigate("/admin/expired-items")}
        >
          <FiArchive size={16} />
          View Expired
        </button>
      </div>

      <div style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} style={styles.statCard}>
            <div
              style={{
                ...styles.statIconWrap,
                backgroundColor: card.accent,
                color: card.iconColor,
              }}
            >
              {card.icon}
            </div>
            <div>
              <h3 style={styles.statValue}>{card.value}</h3>
              <p style={styles.statLabel}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Recent Found Items</h2>
              <p style={styles.sectionSubtext}>Latest submitted found item records</p>
            </div>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate("/admin/manage-found-items")}
            >
              View All
            </button>
          </div>

          {filteredRecentItems.length === 0 ? (
            <p style={styles.emptyText}>No items found.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecentItems.map((item) => (
                    <tr key={item._id} style={styles.tr}>
                      <td style={styles.tdStrong}>{item.title}</td>
                      <td style={styles.td}>{item.category || "N/A"}</td>
                      <td style={styles.td}>{item.foundLocation || "N/A"}</td>
                      <td style={styles.td}>{formatDate(item.dateFound)}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badgeBase, ...getItemStatusStyle(item.status) }}>
                          {formatStatusText(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Recent Claims</h2>
              <p style={styles.sectionSubtext}>Latest student claim requests</p>
            </div>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate("/admin/claim-review")}
            >
              View All
            </button>
          </div>

          {recentClaims.length === 0 ? (
            <p style={styles.emptyText}>No claims found.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Claimed By</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClaims.map((claim) => (
                    <tr key={claim._id} style={styles.tr}>
                      <td style={styles.tdStrong}>{claim.itemId?.title || "Unknown Item"}</td>
                      <td style={styles.td}>{claim.fullName || "N/A"}</td>
                      <td style={styles.td}>{formatDate(claim.createdAt)}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badgeBase, ...getClaimStatusStyle(claim.status) }}>
                          {formatStatusText(claim.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "8px 0 24px 0",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "8px",
  },

  subText: {
    margin: 0,
    fontSize: "15px",
    color: "#6b7280",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "0 14px",
    height: "46px",
    minWidth: "260px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#111827",
    width: "100%",
    background: "transparent",
  },

  iconButton: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },

  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "8px 14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },

  profileName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
  },

  profileRole: {
    margin: "3px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.2,
  },

  actionsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  primaryAction: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f97316",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(249,115,22,0.22)",
  },

  secondaryAction: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  statIconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statValue: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: 1.1,
  },

  statLabel: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "20px",
  },

  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
    overflowX: "auto",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },

  sectionSubtext: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  viewAllBtn: {
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    border: "1px solid #fed7aa",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#6b7280",
    padding: "12px 10px",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "14px 10px",
    fontSize: "14px",
    color: "#374151",
    verticalAlign: "middle",
  },

  tdStrong: {
    padding: "14px 10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    verticalAlign: "middle",
  },

  badgeBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  badgeBlue: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
  },

  badgeGreen: {
    backgroundColor: "#ecfdf5",
    color: "#16a34a",
  },

  badgeRed: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },

  badgeOrange: {
    backgroundColor: "#fff7ed",
    color: "#ea580c",
  },

  badgeGray: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
  },

  emptyText: {
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

export default AdminDashboardPage;