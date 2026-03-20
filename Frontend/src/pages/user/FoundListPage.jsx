import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <div>
            <h1 style={styles.heading}>Found Items Catalog</h1>
            <p style={styles.subText}>
              Browse found items inside the university
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by item name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.headerRight}>
          <button style={styles.notificationButton}>🔔</button>

          <div style={styles.profileBox}>
            <div style={styles.profileTextBox}>
              <span style={styles.profileName}>Hashini</span>
              <span style={styles.profileRole}>Student • UniFind</span>
            </div>
            <div style={styles.profileAvatar}>H</div>
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
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
    width: "100%",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    flexWrap: "wrap",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginLeft: "auto",
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
  },
  searchInput: {
    width: "390px",
    maxWidth: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    marginTop: "4px",
  },
  notificationButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "8px 12px",
  },
  profileTextBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  profileName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  profileRole: {
    fontSize: "12px",
    color: "#6b7280",
  },
  profileAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#fed7aa",
    color: "#9a3412",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
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