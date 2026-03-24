import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLostItems, updateLostItemStatus, deleteLostItem } from "../../api/lostApi.js";

// --- Modern Orange Themed Icons ---
const AdminShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

function AdminManageLostPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    try {
      const result = await getLostItems();
      setItems(result.data || []);
    } catch (err) {
      console.error("Fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateLostItemStatus(id, status);
      fetchItems();
    } catch (err) {
      alert("Status update failed.");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteLostItem(id);
        fetchItems();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lostLocation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div style={styles.loaderWrap}>
      <div style={styles.spinner}></div>
      <p style={{color: '#f97316', fontWeight: '700'}}>Syncing Secure Database...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* --- PREMIUM ORANGE UPPER LAYER (AS REQUESTED) --- */}
        <header style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.badge}>
              <AdminShield />
              <span style={styles.badgeText}>System Administrator</span>
            </div>
            <h1 style={styles.mainHeading}>Manage Lost Database</h1>
            <p style={styles.subHeading}>Monitor, verify, and resolve lost item reports across the platform.</p>
            
            {/* Integrated Search Bar inside Hero */}
            <div style={styles.searchWrapper}>
                <input 
                    type="text" 
                    placeholder="Search records by title or location..." 
                    style={styles.heroSearch}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span style={styles.searchIcon}>🔍</span>
            </div>
          </div>
          <Link to="/" style={styles.exitButton}>Exit Console</Link>
        </header>

        {/* --- STATISTICS HUB --- */}
        <div style={styles.statsRow}>
          {[
            { label: "Total Files", val: items.length, color: "#7c2d12", bar: "#fed7aa" },
            { label: "Open Tickets", val: items.filter(i => i.status === 'open').length, color: "#ea580c", bar: "#f97316" },
            { label: "Resolved", val: items.filter(i => i.status === 'closed').length, color: "#9a3412", bar: "#fdba74" }
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <span style={styles.statLabel}>{s.label}</span>
              <span style={{...styles.statVal, color: s.color}}>{s.val}</span>
              <div style={{...styles.statBar, backgroundColor: s.bar}}></div>
            </div>
          ))}
        </div>

        {/* --- DATA GRID --- */}
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.imageArea}>
                {item.image && (
                  <img src={`http://localhost:5001${item.image}`} alt={item.title} style={styles.img} />
                )}
                <div style={styles.catLabel}>{item.category || "Other"}</div>
              </div>

              <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>{item.title || "Untitled Record"}</h3>
                
                <div style={styles.metaRow}>
                  <span style={styles.metaIcon}>📍</span>
                  <span style={styles.metaText}>{item.lostLocation}</span>
                </div>
                
                <div style={styles.metaRow}>
                  <span style={styles.metaIcon}>👤</span>
                  <span style={styles.metaText}>{item.contactName}</span>
                </div>

                <div style={styles.statusControl}>
                  <label style={styles.controlLabel}>Workstream Status</label>
                  <select 
                    value={item.status} 
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    style={styles.selectInput}
                  >
                    <option value="open">🟠 Active Search</option>
                    <option value="possible_match">🟡 Match Found</option>
                    <option value="closed">⚪ Archived</option>
                  </select>
                </div>

                <div style={styles.footerBtns}>
                  <Link to={`/lost-reports/${item._id}`} style={styles.viewBtn}>Inspect Record</Link>
                  <button onClick={() => handleDelete(item._id, item.title)} style={styles.delBtn}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
            <div style={styles.emptyState}>No matching records found in the database.</div>
        )}
      </div>

      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
        select:focus { outline: 2px solid #fdba74; }
        input:focus { outline: none; border-color: #f97316 !important; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1); }
      `}</style>
    </div>
  );
}

const styles = {
  page: { 
    backgroundColor: "#fffcf9", 
    minHeight: "100vh", 
    padding: "40px 20px",
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  container: { maxWidth: "1250px", margin: "0 auto" },
  
  // --- Hero Section (Upper Layer) ---
  heroSection: {
    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    padding: "50px",
    borderRadius: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
    border: "1px solid #fed7aa",
    boxShadow: "0 20px 40px -15px rgba(249, 115, 22, 0.1)"
  },
  heroContent: { flex: 1 },
  badge: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" },
  badgeText: { fontWeight: "800", color: "#c2410c", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" },
  mainHeading: { fontSize: "38px", fontWeight: "900", color: "#431407", margin: 0, letterSpacing: "-1px" },
  subHeading: { color: "#9a3412", fontSize: "16px", marginTop: "10px", opacity: 0.8 },
  
  searchWrapper: { position: "relative", marginTop: "25px", maxWidth: "500px" },
  heroSearch: { 
    width: "100%", padding: "14px 20px 14px 45px", borderRadius: "16px", 
    border: "1px solid #fed7aa", fontSize: "15px", transition: "0.3s" 
  },
  searchIcon: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 },

  exitButton: { 
    padding: "12px 24px", backgroundColor: "#fff", color: "#ea580c", 
    borderRadius: "14px", textDecoration: "none", fontWeight: "700", 
    border: "1px solid #fed7aa", whiteSpace: "nowrap" 
  },

  // --- Stats Section ---
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "60px" },
  statCard: {
    backgroundColor: "#fff", padding: "28px", borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.02)", border: "1px solid #fef3c7",
    position: "relative", overflow: "hidden"
  },
  statLabel: { fontSize: "13px", fontWeight: "700", color: "#9a3412", textTransform: "uppercase" },
  statVal: { display: "block", fontSize: "34px", fontWeight: "900", marginTop: "10px" },
  statBar: { position: "absolute", bottom: 0, left: 0, height: "5px", width: "100%" },

  // --- Grid & Cards ---
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" },
  card: {
    backgroundColor: "#fff", borderRadius: "30px", border: "1px solid #f1f5f9",
    overflow: "hidden", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  imageArea: { position: "relative", height: "200px", backgroundColor: "#f9fafb" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  catLabel: {
    position: "absolute", bottom: "12px", right: "12px",
    backgroundColor: "rgba(255,255,255,0.9)", padding: "5px 12px",
    borderRadius: "10px", fontSize: "11px", fontWeight: "800", color: "#ea580c"
  },
  cardInfo: { padding: "24px" },
  cardTitle: { fontSize: "19px", fontWeight: "800", color: "#1e293b", margin: "0 0 16px 0" },
  metaRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  metaIcon: { fontSize: "14px" },
  metaText: { fontSize: "14px", color: "#64748b", fontWeight: "500" },
  
  statusControl: { marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" },
  controlLabel: { fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", display: "block" },
  selectInput: {
    width: "100%", padding: "12px", borderRadius: "14px", border: "1.5px solid #fff7ed",
    backgroundColor: "#fff7ed", color: "#c2410c", fontWeight: "700", fontSize: "14px", cursor: "pointer"
  },
  footerBtns: { display: "flex", gap: "10px", marginTop: "24px" },
  viewBtn: {
    flex: 2, textAlign: "center", padding: "12px", backgroundColor: "#f97316",
    color: "#fff", borderRadius: "14px", fontWeight: "700", textDecoration: "none"
  },
  delBtn: {
    flex: 1, padding: "12px", border: "none", backgroundColor: "#fee2e2",
    color: "#ef4444", borderRadius: "14px", fontWeight: "700", cursor: "pointer"
  },

  emptyState: { textAlign: "center", padding: "60px", color: "#94a3b8", fontWeight: "600" },
  loaderWrap: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "15px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #fff7ed", borderTop: "4px solid #f97316", borderRadius: "50%", animation: "rotate 1s linear infinite" }
};

export default AdminManageLostPage;