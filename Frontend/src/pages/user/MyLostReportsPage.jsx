import { useEffect, useMemo, useState } from "react";
import { getLostItems, deleteLostItem } from "../../api/lostApi.js";

function MyLostReportsPage() {
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
        const result = await getLostItems();
        setItems(result.data || []);
      } catch {
        setError("Failed to load lost reports");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filteredCategory === "All Categories" || item.category === filteredCategory;

      const text =
        `${item.title || ""} ${item.lostLocation || ""} ${item.category || ""}`.toLowerCase();

      return matchesCategory && text.includes(searchTerm.toLowerCase());
    });
  }, [items, filteredCategory, searchTerm]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this report?");
    if (!ok) return;

    try {
      await deleteLostItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Failed to delete lost report");
    }
  };

  if (loading) {
    return <div style={styles.stateText}>Loading lost reports...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>My Lost Reports</h1>
          <p style={styles.subText}>
            View and manage the lost items you reported.
          </p>
        </div>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search lost reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
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
        <div style={styles.stateText}>No lost reports available.</div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardCategory}>{item.category}</p>
              <p style={styles.cardText}>
                <strong>Description:</strong> {item.description}
              </p>
              <p style={styles.cardText}>
                <strong>Lost Location:</strong> {item.lostLocation}
              </p>
              <p style={styles.cardText}>
                <strong>Date Lost:</strong>{" "}
                {new Date(item.dateLost).toLocaleDateString()}
              </p>
              <p style={styles.cardText}>
                <strong>Status:</strong> {item.status}
              </p>

              <button
                onClick={() => handleDelete(item._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "30px",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
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
    color: "#ffffff",
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
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    margin: "0 0 6px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  cardCategory: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    color: "#f97316",
    fontWeight: "600",
  },
  cardText: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#374151",
  },
  deleteButton: {
    marginTop: "12px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default MyLostReportsPage;