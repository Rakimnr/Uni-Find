import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFoundItems } from "../../api/foundApi";
import { getAllClaims } from "../../api/claimApi";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/common/ProfileAvatar";
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
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const userName =
    user?.fullName || user?.name || user?.username || "Admin";
  const userRole = user?.role || "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const itemsRes = await getFoundItems();
        const claimsRes = await getAllClaims();

        const items = itemsRes.data || [];
        const claims = claimsRes.claims || [];

        const sortedItems = [...items].sort(
          (a, b) =>
            new Date(b.createdAt || b.dateFound) -
            new Date(a.createdAt || a.dateFound)
        );

        const sortedClaims = [...claims].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setStats({
          totalItems: items.length,
          availableItems: items.filter((item) => item.status === "available")
            .length,
          returnedItems: items.filter((item) => item.status === "returned")
            .length,
          expiredItems: items.filter((item) => item.status === "expired").length,
          totalClaims: claims.length,
          pendingClaims: claims.filter((claim) => claim.status === "pending")
            .length,
          approvedClaims: claims.filter((claim) => claim.status === "approved")
            .length,
          rejectedClaims: claims.filter((claim) => claim.status === "rejected")
            .length,
        });

        setRecentItems(sortedItems.slice(0, 5));
        setRecentClaims(sortedClaims.slice(0, 5));
      } catch (error) {
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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

  const notifications = [];

  if (stats.pendingClaims > 0) {
    notifications.push({
      id: 1,
      title: "Pending Claims",
      text: `You have ${stats.pendingClaims} pending claim${
        stats.pendingClaims > 1 ? "s" : ""
      } waiting for review.`,
    });
  }

  if (stats.expiredItems > 0) {
    notifications.push({
      id: 2,
      title: "Expired Items",
      text: `${stats.expiredItems} item${
        stats.expiredItems > 1 ? "s are" : " is"
      } currently marked as expired.`,
    });
  }

  if (recentClaims.length > 0) {
    notifications.push({
      id: 3,
      title: "Latest Claim",
      text: `Newest claim was submitted on ${formatDate(
        recentClaims[0]?.createdAt
      )}.`,
    });
  }

  if (recentItems.length > 0) {
    notifications.push({
      id: 4,
      title: "Latest Found Item",
      text: `"${recentItems[0]?.title || "New item"}" was recently added.`,
    });
  }

  notifications.push({
    id: 5,
    title: "System Notice",
    text: "Items older than 30 days cannot be claimed online.",
  });

  if (loading) {
    return <p style={styles.stateText}>Loading dashboard...</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Admin Dashboard</h1>
          <p style={styles.subText}>
            Manage found items and claim activity from one place.
          </p>
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

          <div style={styles.menuWrap} ref={notificationRef}>
            <button
              type="button"
              style={styles.iconButton}
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
            >
              <FiBell size={18} />
            </button>

            {showNotifications && (
              <div style={styles.dropdownMenu}>
                <p style={styles.dropdownTitle}>Notifications</p>

                {notifications.map((note, index) => (
                  <div
                    key={note.id}
                    style={{
                      ...styles.dropdownItemBlock,
                      borderBottom:
                        index === notifications.length - 1
                          ? "none"
                          : "1px solid #f1f5f9",
                    }}
                  >
                    <p style={styles.dropdownItemTitle}>{note.title}</p>
                    <p style={styles.dropdownItemText}>{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.menuWrap} ref={profileRef}>
            <button
              type="button"
              style={styles.profileButton}
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
            >
              <div style={styles.profileBox}>
                <ProfileAvatar user={user} size={40} />
                <div style={styles.profileTextWrap}>
                  <p style={styles.profileName}>{userName}</p>
                  <p style={styles.profileRole}>{userRole}</p>
                </div>
                <FiChevronDown size={16} color="#6b7280" />
              </div>
            </button>

            {showProfileMenu && (
              <div style={styles.profileDropdown}>
                <button
                  type="button"
                  style={styles.dropdownAction}
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  <FiUser size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  style={styles.dropdownAction}
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.actionsRow}>
        <button
          type="button"
          style={styles.primaryAction}
          onClick={() => navigate("/admin/add-found-item")}
        >
          <FiPlus size={16} />
          Add Found Item
        </button>

        <button
          type="button"
          style={styles.secondaryAction}
          onClick={() => navigate("/admin/claims")}
        >
          <FiClipboard size={16} />
          Review Claims
        </button>

        <button
          type="button"
          style={styles.secondaryAction}
          onClick={() => navigate("/admin/found-items")}
        >
          <FiPackage size={16} />
          Manage Items
        </button>

        <button
          type="button"
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
              <p style={styles.sectionSubtext}>
                Latest submitted found item records
              </p>
            </div>
            <button
              type="button"
              style={styles.viewAllBtn}
              onClick={() => navigate("/admin/found-items")}
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
                        <span
                          style={{
                            ...styles.badgeBase,
                            ...getItemStatusStyle(item.status),
                          }}
                        >
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
              <p style={styles.sectionSubtext}>
                Latest student claim requests
              </p>
            </div>
            <button
              type="button"
              style={styles.viewAllBtn}
              onClick={() => navigate("/admin/claims")}
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
                      <td style={styles.tdStrong}>
                        {claim.itemId?.title || "Unknown Item"}
                      </td>
                      <td style={styles.td}>{claim.fullName || "N/A"}</td>
                      <td style={styles.td}>{formatDate(claim.createdAt)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badgeBase,
                            ...getClaimStatusStyle(claim.status),
                          }}
                        >
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

  menuWrap: {
    position: "relative",
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

  dropdownMenu: {
    position: "absolute",
    top: "58px",
    right: 0,
    width: "300px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    padding: "14px",
    zIndex: 100,
  },

  dropdownTitle: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  dropdownItemBlock: {
    padding: "10px 0",
  },

  dropdownItemTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
    color: "#111827",
  },

  dropdownItemText: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  profileButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
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

  profileTextWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
    textTransform: "capitalize",
  },

  profileDropdown: {
    position: "absolute",
    top: "64px",
    right: 0,
    width: "200px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    padding: "10px",
    zIndex: 100,
  },

  dropdownAction: {
    width: "100%",
    border: "none",
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
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