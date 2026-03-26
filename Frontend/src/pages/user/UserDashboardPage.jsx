import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";
import { getMyClaims } from "../../api/claimApi";

const UserDashboardPage = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || storedUser?.username || "Hashini";
  const userRole = storedUser?.role || "UniFind User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await getMyClaims();
        setClaims(res.claims || []);
      } catch (error) {
        console.error("Failed to load user dashboard data", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
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

  const stats = {
    total: claims.length,
    pending: claims.filter((claim) => claim.status === "pending").length,
    approved: claims.filter((claim) => claim.status === "approved").length,
    rejected: claims.filter((claim) => claim.status === "rejected").length,
  };

  const recentClaims = [...claims]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const notifications = [];

  if (stats.pending > 0) {
    notifications.push({
      id: 1,
      title: "Pending Claims",
      text: `You have ${stats.pending} pending claim${
        stats.pending > 1 ? "s" : ""
      } awaiting approval.`,
    });
  }

  if (stats.approved > 0) {
    notifications.push({
      id: 2,
      title: "Approved Claims",
      text: `${stats.approved} of your claim${
        stats.approved > 1 ? "s have" : " has"
      } been approved.`,
    });
  }

  notifications.push({
    id: 3,
    title: "Total Claims",
    text: `You have submitted ${stats.total} claim${
      stats.total !== 1 ? "s" : ""
    } in total.`,
  });

  notifications.push({
    id: 4,
    title: "System Notice",
    text: "Items older than 30 days cannot be claimed online.",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getStatusStyle = (status) => {
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
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statCards = [
    {
      label: "Total Claims",
      value: stats.total,
      icon: <FiClipboard size={20} />,
      accent: "#f8fafc",
      iconColor: "#475569",
    },
    {
      label: "Pending Claims",
      value: stats.pending,
      icon: <FiClock size={20} />,
      accent: "#fff7ed",
      iconColor: "#ea580c",
    },
    {
      label: "Approved Claims",
      value: stats.approved,
      icon: <FiCheckCircle size={20} />,
      accent: "#ecfdf5",
      iconColor: "#16a34a",
    },
    {
      label: "Rejected Claims",
      value: stats.rejected,
      icon: <FiXCircle size={20} />,
      accent: "#fef2f2",
      iconColor: "#dc2626",
    },
  ];

  if (loading) {
    return <p style={styles.stateText}>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div style={styles.errorCard}>
        <FiAlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>User Dashboard</h1>
          <p style={styles.subText}>
            Track your claim activity and access important actions quickly.
          </p>
        </div>

        <div style={styles.topBarRight}>
          <div style={styles.menuWrap} ref={notificationRef}>
            <button
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

                {notifications.map((note) => (
                  <div key={note.id} style={styles.dropdownItemBlock}>
                    <p style={styles.dropdownItemTitle}>{note.title}</p>
                    <p style={styles.dropdownItemText}>{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.menuWrap} ref={profileRef}>
            <button
              style={styles.profileButton}
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
            >
              <div style={styles.profileBox}>
                <div style={styles.avatar}>{userInitial}</div>
                <div style={styles.profileTextWrap}>
                  <p style={styles.profileName}>{userName}</p>
                  <p style={styles.profileRole}>{userRole}</p>
                </div>
                <FiChevronDown size={16} color="#6b7280" />
              </div>
            </button>

            {showProfileMenu && (
              <div style={styles.profileDropdown}>
                <button style={styles.dropdownAction}>
                  <FiUser size={16} />
                  <span>My Profile</span>
                </button>

                <button style={styles.dropdownAction} onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.welcomeCard}>
        <div>
          <h2 style={styles.welcomeTitle}>Welcome back, {userName}</h2>
          <p style={styles.welcomeText}>
            Here is a quick overview of your claim activity in UniFind.
          </p>
        </div>
      </div>

      <div style={styles.actionsRow}>
        <button style={styles.primaryAction} onClick={() => navigate("/")}>
          Browse Found Items
        </button>

        <button
          style={styles.secondaryAction}
          onClick={() => navigate("/my-claims")}
        >
          View My Claims
        </button>

        <button
          style={styles.secondaryAction}
          onClick={() => navigate("/report-found-item")}
        >
          Report Found Item
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

      <div style={styles.noticeCard}>
        <div style={styles.cardHeaderSimple}>
          <h2 style={styles.sectionTitle}>System Notices</h2>
        </div>
        <ul style={styles.noticeList}>
          <li>Pending claims need admin review before approval.</li>
          <li>Expired items cannot be claimed online after 30 days.</li>
          <li>Recent claims are displayed from newest to oldest.</li>
        </ul>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Recent Claims</h2>
            <p style={styles.sectionSubtext}>Your latest submitted claims</p>
          </div>
          <button
            style={styles.viewAllBtn}
            onClick={() => navigate("/my-claims")}
          >
            View All
          </button>
        </div>

        {recentClaims.length === 0 ? (
          <p style={styles.emptyText}>You have not submitted any claims yet.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
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
                    <td style={styles.td}>{formatDate(claim.createdAt)}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badgeBase,
                          ...getStatusStyle(claim.status),
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
    marginBottom: "20px",
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
    flexShrink: 0,
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
  dropdownMenu: {
    position: "absolute",
    top: "56px",
    right: 0,
    width: "290px",
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
    borderBottom: "1px solid #f1f5f9",
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
  profileDropdown: {
    position: "absolute",
    top: "62px",
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
  welcomeCard: {
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
    border: "1px solid #fed7aa",
    borderRadius: "22px",
    padding: "24px",
    marginBottom: "22px",
  },
  welcomeTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
  },
  welcomeText: {
    margin: "10px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  actionsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  primaryAction: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryAction: {
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
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
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
  },
  statLabel: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  noticeCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  },
  cardHeaderSimple: {
    marginBottom: "8px",
  },
  noticeList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#4b5563",
    lineHeight: 1.8,
    fontSize: "14px",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
  },
  sectionSubtext: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  viewAllBtn: {
    border: "none",
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
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
  errorCard: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontWeight: "600",
  },
};

export default UserDashboardPage;