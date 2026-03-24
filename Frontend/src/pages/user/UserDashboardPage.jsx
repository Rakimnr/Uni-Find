import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { getMyClaims } from "../../api/claimApi";

const UserDashboardPage = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await getMyClaims();
        setClaims(res.claims || []);
      } catch (error) {
        console.error("Failed to load user dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
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
          <button style={styles.iconButton}>
            <FiBell size={18} />
          </button>

          <div style={styles.profileBox}>
            <div style={styles.avatar}>H</div>
            <div>
              <p style={styles.profileName}>Hashini</p>
              <p style={styles.profileRole}>UniFind User</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.welcomeCard}>
        <div>
          <h2 style={styles.welcomeTitle}>Welcome back, Hashini</h2>
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
  welcomeCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
    marginBottom: "20px",
  },
  welcomeTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  welcomeText: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },
  actionsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  primaryAction: {
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

export default UserDashboardPage;