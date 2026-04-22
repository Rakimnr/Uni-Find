import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCalendar,
  FiChevronDown,
  FiEye,
  FiLogOut,
  FiMapPin,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { getLostItems } from "../../api/lostApi";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/common/ProfileAvatar";

const LostCatalogCard = ({ item }) => {
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    if (status === "open") return "OPEN REPORT";
    if (status === "possible_match") return "POSSIBLE MATCH";
    if (status === "closed") return "CLOSED";
    return (status || "OPEN").toUpperCase().replaceAll("_", " ");
  };

  const getBadgeStyle = (status) => {
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
      backgroundColor: "#f97316",
      color: "#ffffff",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    if (typeof dateString === "string" && dateString.includes("/")) {
      return dateString;
    }

    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
  };

  const imageSrc = item?.image?.trim()
    ? `http://localhost:5001${item.image}`
    : "https://via.placeholder.com/300x180?text=Lost+Item";

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <span
          style={{
            ...styles.badge,
            ...getBadgeStyle(item.status),
          }}
        >
          {getStatusLabel(item.status)}
        </span>

        <img
          src={imageSrc}
          alt={item.title || "Lost Item"}
          style={styles.image}
        />
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{item.title || "Untitled Item"}</h3>

        <div style={styles.metaGroup}>
          <div style={styles.metaRow}>
            <FiMapPin size={15} style={styles.metaIcon} />
            <span style={styles.locationText}>
              {item.lostLocation || "Unknown location"}
            </span>
          </div>

          <div style={styles.metaRow}>
            <FiCalendar size={15} style={styles.metaIcon} />
            <span style={styles.metaText}>{formatDate(item.dateLost)}</span>
          </div>
        </div>

        <p style={styles.description}>
          {item.description || "No description available."}
        </p>

        <button
          type="button"
          style={styles.actionButton}
          onClick={() =>
            navigate(`/lost-reports/${item._id}`, {
              state: {
                backTo: "/lost-items",
                backLabel: "Back to Gallery",
                dashboardTo: "/dashboard",
                dashboardLabel: "Dashboard",
              },
            })
          }
        >
          <FiEye size={16} />
          View Report
        </button>
      </div>
    </div>
  );
};

const LostItemsCatalogPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const userName =
    user?.fullName || user?.name || user?.username || "User";
  const userRole = user?.role || "member";

  const categories = [
    "All Categories",
    "Electronics",
    "Documents",
    "Bags",
    "Accessories",
    "Stationery",
    "Clothing",
    "Other",
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getLostItems();
        setItems(result.data || []);
      } catch (err) {
        setError("Failed to load lost items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
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

  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);

    if (typeof dateString === "string" && dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
    }

    return new Date(dateString);
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory =
          filteredCategory === "All Categories" ||
          item.category === filteredCategory;

        const text = `${item.title || ""} ${item.lostLocation || ""} ${
          item.category || ""
        } ${item.description || ""} ${item.uniqueFeatures || ""}`.toLowerCase();

        const matchesSearch = text.includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => parseDate(b.dateLost) - parseDate(a.dateLost));
  }, [items, filteredCategory, searchTerm]);

  const notifications = [
    {
      id: 1,
      title: "Lost Reports",
      text: `There ${items.length === 1 ? "is" : "are"} ${items.length} lost report${
        items.length !== 1 ? "s" : ""
      } available.`,
    },
    {
      id: 2,
      title: "Search Feature",
      text: "Use search and category filters to quickly find similar lost reports.",
    },
    {
      id: 3,
      title: "System Notice",
      text: "Open reports may later move to possible match or closed status.",
    },
  ];

  if (loading) {
    return <div style={styles.stateText}>Loading lost items...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Lost Items Catalog</h1>
          <p style={styles.subText}>
            Browse lost item reports inside the university
          </p>
        </div>

        <div style={styles.topBarRight}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search by item name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      <div style={styles.filters}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilteredCategory(category)}
            style={{
              ...styles.filterButton,
              ...(filteredCategory === category ? styles.activeFilter : {}),
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div style={styles.emptyBox}>No lost items available.</div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <LostCatalogCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: "0",
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
    minWidth: "320px",
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

  dropdownMenu: {
    position: "absolute",
    top: "58px",
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

  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "26px",
  },

  filterButton: {
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "10px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    color: "#374151",
    fontWeight: "500",
    fontSize: "14px",
  },

  activeFilter: {
    backgroundColor: "#f97316",
    color: "white",
    border: "1px solid #f97316",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    width: "100%",
    alignItems: "stretch",
  },

  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },

  emptyBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "36px 20px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "16px",
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "0.2s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  imageWrapper: {
    position: "relative",
    height: "180px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 10px",
    borderRadius: "999px",
    zIndex: 1,
  },

  content: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 12px 0",
    color: "#111827",
    lineHeight: "1.35",
    minHeight: "48px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  metaGroup: {
    minHeight: "52px",
  },

  metaRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "8px",
  },

  metaIcon: {
    color: "#f97316",
    marginTop: "2px",
    flexShrink: 0,
  },

  metaText: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.45",
  },

  locationText: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.45",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "40px",
  },

  description: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.55,
    minHeight: "66px",
    margin: "8px 0 14px 0",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  actionButton: {
    marginTop: "auto",
    width: "100%",
    backgroundColor: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "11px 12px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

export default LostItemsCatalogPage;