import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyClaims } from "../../api/claimApi";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/common/ProfileAvatar";

const MyClaimsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const userName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    "User";
  const userRole = user?.role || "member";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      title: "Your Claims",
      text: `You have submitted ${claims.length} claim${
        claims.length !== 1 ? "s" : ""
      }.`,
    },
    {
      id: 2,
      title: "Pending Review",
      text: "Admin will review your claims soon.",
    },
    {
      id: 3,
      title: "System Notice",
      text: "Items older than 30 days cannot be claimed online.",
    },
  ];

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getMyClaims();
        setClaims(data.claims || []);
      } catch (err) {
        setError("Failed to load claims.");
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

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "rejected") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  };

  if (loading) {
    return <div style={styles.stateText}>Loading claims...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerBar}>
        <div>
          <h1 style={styles.heading}>My Claims</h1>
          <p style={styles.subText}>
            Track the status of items you have claimed.
          </p>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.menuWrap} ref={notificationRef}>
            <button
              type="button"
              style={styles.notificationButton}
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

                <div style={styles.profileTextBox}>
                  <span style={styles.profileName}>{userName}</span>
                  <span style={styles.profileRole}>{userRole}</span>
                </div>

                <FiChevronDown size={16} color="#6b7280" />
              </div>
            </button>

            {showProfileMenu && (
              <div style={styles.profileDropdown}>
                <button
                  type="button"
                  style={styles.dropdownAction}
                  onClick={() => navigate("/profile")}
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

      {claims.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3 style={styles.emptyTitle}>No claims yet</h3>
          <p style={styles.emptyText}>
            You have not submitted any claim requests yet.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {claims.map((claim) => {
            const itemImage = claim.itemId?.image
              ? `http://localhost:5001${claim.itemId.image}`
              : "https://via.placeholder.com/300x180?text=Claimed+Item";

            return (
              <div key={claim._id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(claim.status),
                    }}
                  >
                    {claim.status?.toUpperCase()}
                  </span>

                  <img
                    src={itemImage}
                    alt={claim.itemId?.title || "Claimed item"}
                    style={styles.image}
                  />
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {claim.itemId?.title || "Unknown Item"}
                  </h3>

                  <p style={styles.meta}>
                    <strong>Lost Location:</strong>{" "}
                    {claim.lostLocation || "Unknown"}
                  </p>

                  <p style={styles.meta}>
                    <strong>Lost Date:</strong> {formatDate(claim.lostDate)}
                  </p>

                  <p style={styles.meta}>
                    <strong>Claimed On:</strong> {formatDate(claim.createdAt)}
                  </p>

                  <p style={styles.reason}>
                    <strong>Reason:</strong>{" "}
                    {claim.reason || "No reason provided"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: "0",
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
    fontWeight: "800",
    marginBottom: "8px",
  },
  subText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginLeft: "auto",
    flexWrap: "wrap",
  },
  menuWrap: {
    position: "relative",
  },
  notificationButton: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  profileTextBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
  },
  profileRole: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.2,
    marginTop: "3px",
    textTransform: "capitalize",
  },
  dropdownMenu: {
    position: "absolute",
    top: "58px",
    right: 0,
    width: "280px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 340px))",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  imageWrapper: {
    position: "relative",
    height: "180px",
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
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 1,
  },
  cardContent: {
    padding: "16px",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },
  meta: {
    fontSize: "14px",
    color: "#4b5563",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  reason: {
    fontSize: "14px",
    color: "#374151",
    marginTop: "12px",
    lineHeight: "1.6",
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
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default MyClaimsPage;