import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getLostItems, deleteLostItem } from "../../api/lostApi.js";
import LostCard from "../../components/lost/LostCard.jsx";

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f8f4ef 0%, #fffaf5 45%, #f4ede4 100%);
    color: #0f172a;
  }

  .reports-shell {
    min-height: 100vh;
    padding: 30px 18px 50px;
    position: relative;
    overflow: visible;
  }

  .reports-shell::before {
    content: "";
    position: fixed;
    top: -150px;
    right: -140px;
    width: 420px;
    height: 420px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.04) 42%, transparent 74%);
    filter: blur(10px);
    pointer-events: none;
  }

  .reports-shell::after {
    content: "";
    position: fixed;
    left: -150px;
    bottom: -180px;
    width: 460px;
    height: 460px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.03) 42%, transparent 75%);
    filter: blur(12px);
    pointer-events: none;
  }

  .reports-container {
    max-width: 1240px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .reports-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 18px;
  }

  .reports-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 4.2vw, 50px);
    line-height: 1;
    letter-spacing: -1.4px;
    color: #0f172a;
  }

  .reports-subtitle {
    margin: 10px 0 0;
    color: rgba(15,23,42,0.66);
    font-size: 15px;
    line-height: 1.7;
  }

  .reports-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ghost-btn,
  .primary-btn {
    height: 46px;
    padding: 0 18px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .ghost-btn {
    background: rgba(255,255,255,0.88);
    border: 1px solid rgba(15,23,42,0.08);
    color: #0f172a;
    box-shadow: 0 8px 18px rgba(15,23,42,0.05);
  }

  .primary-btn {
    border: none;
    color: #ffffff;
    background: linear-gradient(135deg, #ff8a1f 0%, #f97316 100%);
    box-shadow: 0 14px 24px rgba(249,115,22,0.24);
  }

  .ghost-btn:hover,
  .primary-btn:hover {
    transform: translateY(-2px);
  }

  .hero-card,
  .content-card,
  .empty-card,
  .error-card {
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.82);
    backdrop-filter: blur(16px);
    box-shadow: 0 18px 42px rgba(15,23,42,0.08);
    border-radius: 30px;
  }

  .hero-card {
    padding: 26px;
    margin-bottom: 22px;
    position: relative;
    z-index: 5;
    overflow: visible;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .stat-chip {
    padding: 18px;
    border-radius: 20px;
    background: rgba(248,250,252,0.88);
    border: 1px solid rgba(15,23,42,0.05);
  }

  .stat-value {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .stat-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(15,23,42,0.56);
  }

  .filter-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 250px;
    gap: 14px;
    align-items: center;
    overflow: visible;
  }

  .search-box {
    height: 56px;
    border-radius: 18px;
    border: 1px solid #d7e0eb;
    background: rgba(248,250,252,0.92);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .search-box:focus-within {
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.10);
    background: #ffffff;
  }

  .search-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: #0f172a;
  }

  .search-input::placeholder {
    color: #94a3b8;
  }

  .filter-dropdown-root {
    position: relative;
  }

  .filter-dropdown-btn {
    width: 100%;
    height: 56px;
    border-radius: 18px;
    border: 1px solid #d7e0eb;
    background: rgba(248,250,252,0.92);
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #0f172a;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .filter-dropdown-btn:hover {
    background: #ffffff;
  }

  .filter-dropdown-btn.is-open {
    border-color: #f97316;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.10);
    background: #ffffff;
  }

  .filter-dropdown-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .filter-dropdown-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .filter-dropdown-backdrop {
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: 99998;
  }

  .filter-dropdown-menu-portal {
    position: fixed;
    background: #ffffff;
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 18px;
    box-shadow: 0 22px 38px rgba(15,23,42,0.14);
    padding: 8px;
    z-index: 99999;
    max-height: 320px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .filter-option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 14px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
  }

  .filter-option:hover {
    background: rgba(249,115,22,0.08);
  }

  .filter-option.active {
    background: linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.06));
    color: #c2410c;
  }

  .content-card {
    padding: 20px;
    position: relative;
    z-index: 1;
  }

  .results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  .results-text {
    font-size: 14px;
    font-weight: 700;
    color: rgba(15,23,42,0.68);
  }

  .reset-filter-btn {
    height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid #dbe4ee;
    background: rgba(255,255,255,0.88);
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 22px;
    align-items: stretch;
  }

  .report-card-shell {
    transition: transform 0.22s ease;
  }

  .report-card-shell:hover {
    transform: translateY(-6px);
  }

  .report-card-shell > * {
    width: 100%;
  }

  .empty-card,
  .error-card {
    padding: 34px 24px;
    text-align: center;
  }

  .empty-title,
  .error-title {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }

  .empty-sub,
  .error-sub {
    margin: 0;
    color: rgba(15,23,42,0.60);
    font-size: 15px;
    line-height: 1.7;
  }

  .loader-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f4ef 0%, #fffaf5 45%, #f4ede4 100%);
  }

  .loader-wrap {
    text-align: center;
  }

  .spinner {
    width: 46px;
    height: 46px;
    border: 3px solid rgba(15,23,42,0.10);
    border-top-color: #f97316;
    border-radius: 999px;
    animation: rotate 0.9s linear infinite;
    margin: 0 auto 14px;
  }

  .loader-text {
    font-size: 14px;
    font-weight: 700;
    color: rgba(15,23,42,0.58);
  }

  .error-card {
    margin-bottom: 18px;
    background: rgba(254,242,242,0.86);
    border-color: rgba(239,68,68,0.16);
  }

  .error-title {
    color: #991b1b;
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 920px) {
    .reports-topbar {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats-row {
      grid-template-columns: 1fr;
    }

    .filter-shell {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .reports-shell {
      padding: 22px 14px 34px;
    }

    .hero-card,
    .content-card,
    .empty-card,
    .error-card {
      border-radius: 24px;
    }

    .hero-card {
      padding: 20px;
    }

    .content-card {
      padding: 16px;
    }

    .cards-grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
`;

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CategoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function CategoryDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 10,
      left: rect.left,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const portalMenu =
    open &&
    createPortal(
      <>
        <div className="filter-dropdown-backdrop" onClick={() => setOpen(false)} />
        <div
          className="filter-dropdown-menu-portal"
          style={{
            top: `${menuStyle.top}px`,
            left: `${menuStyle.left}px`,
            width: `${menuStyle.width}px`,
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`filter-option ${value === option ? "active" : ""}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </>,
      document.body
    );

  return (
    <div className="filter-dropdown-root" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`filter-dropdown-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="filter-dropdown-left">
          <CategoryIcon />
          <span className="filter-dropdown-text">{value}</span>
        </span>
        <ChevronIcon />
      </button>
      {portalMenu}
    </div>
  );
}

function MyLostReportsPage() {
  const [items, setItems] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [
      "All Categories",
      "Electronics",
      "Documents",
      "Bags",
      "Accessories",
      "Stationery",
      "Clothing",
      "Other",
    ],
    []
  );

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
    const search = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        filteredCategory === "All Categories" ||
        item.category === filteredCategory;

      const text = [
        item.title,
        item.lostLocation,
        item.category,
        item.description,
        item.uniqueFeatures,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!search || text.includes(search));
    });
  }, [items, filteredCategory, searchTerm]);

  const totalReports = items.length;
  const openReports = items.filter((item) => item.status === "open").length;
  const categoryCount = new Set(items.map((item) => item.category).filter(Boolean)).size;

  const resetFilters = () => {
    setSearchTerm("");
    setFilteredCategory("All Categories");
  };

  const handleDelete = async (id) => {
    const target = items.find((item) => item._id === id);
    const confirmed = window.confirm(`Delete "${target?.title || "this report"}"?`);
    if (!confirmed) return;

    try {
      await deleteLostItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="loader-page">
        <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
        <div className="loader-wrap">
          <div className="spinner" />
          <div className="loader-text">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-shell">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <div className="reports-container">
        <div className="reports-topbar">
          <div>
            <h1 className="reports-title">My Lost Reports</h1>
            <p className="reports-subtitle">
              Track, search, and manage your lost item submissions in one place.
            </p>
          </div>

          <div className="reports-actions">
            <Link to="/" className="ghost-btn">
              Home
            </Link>
            <Link to="/report-lost" className="primary-btn">
              + New Report
            </Link>
          </div>
        </div>

        <section className="hero-card">
          <div className="stats-row">
            <div className="stat-chip">
              <span className="stat-value">{totalReports}</span>
              <span className="stat-label">Total reports</span>
            </div>

            <div className="stat-chip">
              <span className="stat-value">{openReports}</span>
              <span className="stat-label">Open reports</span>
            </div>

            <div className="stat-chip">
              <span className="stat-value">{categoryCount}</span>
              <span className="stat-label">Active categories</span>
            </div>
          </div>

          <div className="filter-shell">
            <div className="search-box">
              <SearchIcon />
              <input
                className="search-input"
                placeholder="Search by title, location, category, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <CategoryDropdown
              value={filteredCategory}
              options={categories}
              onChange={setFilteredCategory}
            />
          </div>
        </section>

        {error && (
          <div className="error-card">
            <h3 className="error-title">Sync problem</h3>
            <p className="error-sub">{error}</p>
          </div>
        )}

        <section className="content-card">
          <div className="results-bar">
            <div className="results-text">
              Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> reports
            </div>

            {(searchTerm || filteredCategory !== "All Categories") && (
              <button className="reset-filter-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-card">
              <h3 className="empty-title">No matching reports</h3>
              <p className="empty-sub">
                Try a different keyword or category, or clear the filters to see all reports.
              </p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredItems.map((item) => (
                <div key={item._id} className="report-card-shell">
                  <LostCard item={item} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyLostReportsPage;