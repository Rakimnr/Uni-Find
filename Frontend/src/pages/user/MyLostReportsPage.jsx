import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLostItems, deleteLostItem } from "../../api/lostApi.js";
import LostCard from "../../components/lost/LostCard.jsx";

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
        setError("Failed to load lost reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filteredCategory === "All Categories" ||
        item.category === filteredCategory;

      const text =
        `${item.title || ""} ${item.lostLocation || ""} ${
          item.category || ""
        }`.toLowerCase();

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
      alert("Failed to delete lost report.");
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
            View, search, and manage your reported lost items.
          </p>
        </div>

        <div style={styles.topActions}>
          <Link to="/" style={styles.navButton}>
            Home
          </Link>
          <Link to="/report-lost" style={styles.primaryButton}>
            + New Report
          </Link>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search lost reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={filteredCategory}
          onChange={(e) => setFilteredCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div style={styles.emptyBox}>No lost reports available.</div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <LostCard key={item._id} item={item} onDelete={handleDelete} />
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
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },
  subText: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
  },
  topActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  navButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  primaryButton: {
    textDecoration: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  searchInput: {
    flex: "1",
    minWidth: "260px",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  select: {
    minWidth: "220px",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "#ffffff",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default MyLostReportsPage;