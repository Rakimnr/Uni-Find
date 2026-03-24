import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLostItems, deleteLostItem } from "../../api/lostApi.js";
import LostCard from "../../components/lost/LostCard.jsx";

// --- Premium Icons ---
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const CategoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

function MyLostReportsPage() {
  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All Categories", "Electronics", "Documents", "Bags", "Accessories", "Stationery", "Clothing", "Other"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getLostItems();
        setItems(result.data || []);
      } catch {
        setError("Unable to sync reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = filteredCategory === "All Categories" || item.category === filteredCategory;
      const text = `${item.title} ${item.lostLocation} ${item.category}`.toLowerCase();
      return matchesCategory && text.includes(searchTerm.toLowerCase());
    });
  }, [items, filteredCategory, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await deleteLostItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  if (loading) return <div style={styles.loaderPage}><div style={styles.spinner}></div></div>;

  return (
    <div style={styles.page}>
      {/* --- UPPER LAYER: DYNAMIC HERO --- */}
      <div style={styles.heroBackground}>
        <div style={styles.container}>
          <nav style={styles.nav}>
            <div style={styles.brand}>
              <h1 style={styles.title}>My Lost Reports</h1>
              <p style={styles.subtitle}>Track and manage your lost items in real-time.</p>
            </div>
            <div style={styles.navActions}>
              <Link to="/" style={styles.ghostBtn}>Home</Link>
              <Link to="/report-lost" style={styles.ctaBtn}>+ New Report</Link>
            </div>
          </nav>

          {/* --- THE FLOATING FILTER SHELL --- */}
          <div style={styles.filterShell}>
            <div style={styles.searchBox}>
              <SearchIcon />
              <input 
                style={styles.input} 
                placeholder="Search by name, location, or details..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.divider}></div>
            <div style={styles.categoryBox}>
              <CategoryIcon />
              <select 
                style={styles.select}
                value={filteredCategory}
                onChange={(e) => setFilteredCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* --- LOWER LAYER: THE GRID --- */}
      <div style={styles.container}>
        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No reports match your search.</p>
            <button onClick={() => {setSearchTerm(""); setFilteredCategory("All Categories")}} style={styles.resetBtn}>Reset Filters</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredItems.map((item) => (
              <div key={item._id} style={styles.cardHoverWrap}>
                <LostCard item={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
        body { margin: 0; font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#fcfcfd",
    minHeight: "100vh",
    paddingBottom: "100px",
  },
  heroBackground: {
    background: "radial-gradient(circle at 20% 10%, #1e293b 0%, #0f172a 100%)",
    padding: "60px 0 100px 0",
    marginBottom: "40px",
    color: "#fff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    color: "#94a3b8",
    margin: "8px 0 0 0",
    fontSize: "16px",
  },
  navActions: { display: "flex", gap: "12px" },
  ctaBtn: {
    backgroundColor: "#f97316",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.4)",
  },
  ghostBtn: {
    color: "#fff",
    padding: "12px 20px",
    textDecoration: "none",
    fontWeight: "600",
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  filterShell: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "8px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    color: "#1e293b",
    border: "1px solid rgba(255,255,255,0.8)",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: "12px",
    color: "#94a3b8",
  },
  categoryBox: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: "10px",
    color: "#94a3b8",
  },
  divider: { width: "1px", height: "30px", backgroundColor: "#e2e8f0" },
  input: {
    width: "100%",
    border: "none",
    padding: "12px 0",
    fontSize: "15px",
    outline: "none",
    color: "#1e293b",
  },
  select: {
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "32px",
  },
  cardHoverWrap: {
    transition: "transform 0.2s ease-in-out",
  },
  emptyState: {
    textAlign: "center",
    padding: "100px 0",
    color: "#64748b",
  },
  resetBtn: {
    marginTop: "16px",
    background: "none",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  loaderPage: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  spinner: { width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "rotate 1s linear infinite" }
};

export default MyLostReportsPage;