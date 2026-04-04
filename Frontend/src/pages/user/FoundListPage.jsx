import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { getFoundItems } from "../../api/foundApi";
import FoundCard from "../../components/found/FoundCard";
import { useAuth } from "../../context/AuthContext";

const FoundListPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName =
    storedUser?.fullName ||
    storedUser?.name ||
    storedUser?.username ||
    "User";
  const userRole = storedUser?.role || "member";
  const userInitial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getFoundItems();
        setItems(result.data || []);
      } catch (err) {
        setError("Failed to load found items");
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

  const notifications = [
    {
      id: 1,
      title: "Browse Items",
      text: `There ${
        items.length === 1 ? "is" : "are"
      } ${items.length} found item${items.length !== 1 ? "s" : ""} available.`,
    },
    {
      id: 2,
      title: "Search Feature",
      text: "Use search and category filters to quickly find your item.",
    },
    {
      id: 3,
      title: "System Notice",
      text: "Items older than 30 days cannot be claimed online.",
    },
  ];

  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);

    if (dateString.includes("/")) {
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

        const text =
          `${item.title || ""} ${item.foundLocation || ""} ${
            item.category || ""
          }`.toLowerCase();

        const matchesSearch = text.includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => parseDate(b.dateFound) - parseDate(a.dateFound));
  }, [items, filteredCategory, searchTerm]);

  if (loading) {
    return <div style={styles.stateText}>Loading found items...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Found Items Catalog</h1>
          <p style={styles.subText}>Browse found items inside the university</p>
        </div>

        <div style={styles.topBarRight}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6b7280" />
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
                <button
  style={styles.dropdownAction}
  onClick={() => navigate("/profile")}
>
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

      <div style={styles.tabs}>
        <button style={{ ...styles.tabButton, ...styles.activeTab }}>
          Found Items
        </button>

        <button
          style={styles.tabButton}
          onClick={() => navigate("/my-claims")}
        >
          My Claims
        </button>
      </div>

      <div style={styles.filters}>
        {categories.map((category) => (
          <button
            key={category}
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
        <div style={styles.stateText}>No found items available.</div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <FoundCard key={item._id} item={item} />
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
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  tabButton: {
    border: "none",
    backgroundColor: "#f1f5f9",
    padding: "11px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px",
  },
  activeTab: {
    backgroundColor: "#fff7ed",
    color: "#f97316",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 260px))",
    gap: "20px",
    width: "100%",
    alignItems: "start",
    justifyContent: "start",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default FoundListPage;