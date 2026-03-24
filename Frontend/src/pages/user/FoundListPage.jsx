import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch } from "react-icons/fi";
import { getFoundItems } from "../../api/foundApi";
import FoundCard from "../../components/found/FoundCard";

const FoundListPage = () => {
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
          `${item.title || ""} ${item.foundLocation || ""} ${item.category || ""}`.toLowerCase();

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