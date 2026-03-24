import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFoundItems } from "../../api/foundApi";
import FoundCard from "../../components/found/FoundCard";

const MyReportedItemsPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const fetchMyItems = async () => {
      try {
        const result = await getMyFoundItems();
        setItems(result.data || []);
      } catch (err) {
        setError("Failed to load your reported items");
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filteredCategory === "All Categories" ||
        item.category === filteredCategory;

      const text =
        `${item.title || ""} ${item.foundLocation || ""} ${item.category || ""}`.toLowerCase();

      const matchesSearch = text.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [items, filteredCategory, searchTerm]);

  if (loading) {
    return <div style={styles.stateText}>Loading your reported items...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={styles.heading}>My Reported Items</h1>
          <p style={styles.subText}>
            View and manage only the found items you uploaded
          </p>
        </div>

        <div style={styles.headerRight}>
          <input
            type="text"
            placeholder="Search my items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          <button style={styles.notificationButton}>🔔</button>

          <div style={styles.profileBox}>
            <div style={styles.profileAvatar}>H</div>
            <div style={styles.profileTextBox}>
              <span style={styles.profileName}>Hashini</span>
              <span style={styles.profileRole}>UniFind User</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={styles.tabButton}
          onClick={() => navigate("/found")}
        >
          All Found Items
        </button>

        <button style={{ ...styles.tabButton, ...styles.activeTab }}>
          My Reported Items
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
        <div style={styles.stateText}>You have not reported any found items yet.</div>
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
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
    fontWeight: "700",
  },
  subText: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
    marginBottom: 0,
  },
  searchInput: {
    width: "280px",
    maxWidth: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },
  notificationButton: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "6px 12px",
  },
  profileTextBox: {
    display: "flex",
    flexDirection: "column",
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
  },
  profileAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    flexShrink: 0,
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

export default MyReportedItemsPage;