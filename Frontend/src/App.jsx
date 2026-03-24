import { Routes, Route, Link, Navigate } from "react-router-dom";
import ReportLostItemPage from "./pages/user/ReportLostItemPage.jsx";
import MyLostReportsPage from "./pages/user/MyLostReportsPage.jsx";
import LostItemDetailsPage from "./pages/user/LostItemDetailsPage.jsx";
import EditLostItemPage from "./pages/user/EditLostItemPage.jsx";
import AdminManageLostPage from "./pages/admin/AdminManageLostPage.jsx";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0d0d0d;
    color: #f5f0e8;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  @keyframes subtlePulse {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 0.85; }
  }

  .hero-card {
    animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .eyebrow {
    animation: fadeUp 0.6s 0.05s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .hero-title {
    animation: fadeUp 0.7s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .divider-line {
    animation: lineGrow 0.8s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: left;
  }

  .hero-desc {
    animation: fadeUp 0.7s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .btn-group {
    animation: fadeUp 0.7s 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nav-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.25s ease;
  }
  .nav-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--card-shine);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .nav-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.45);
  }
  .nav-card:hover::before { opacity: 1; }

  .floating-orb {
    animation: subtlePulse 5s ease-in-out infinite;
  }

  .stat-chip {
    animation: fadeUp 0.7s 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: globalStyles }} />;
}

function HomePage() {
  return (
    <div style={styles.page}>
      <StyleInjector />

      {/* Background orbs */}
      <div className="floating-orb" style={styles.orb1} />
      <div className="floating-orb" style={{ ...styles.orb1, ...styles.orb2 }} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.navDot} />
          <span style={styles.navName}>UniFind</span>
        </div>
        <span style={styles.navTagline}>University Lost & Found</span>
      </nav>

      {/* Hero */}
      <main style={styles.main}>
        <div className="hero-card" style={styles.heroCard}>

          <p className="eyebrow" style={styles.eyebrow}>STUDENT PORTAL</p>

          <h1 className="hero-title" style={styles.title}>
            Lost something<br />
            <span style={styles.titleAccent}>on campus?</span>
          </h1>

          <div className="divider-line" style={styles.divider} />

          <p className="hero-desc" style={styles.desc}>
            Report lost items, track your submissions, and coordinate with
            campus staff — all in one place.
          </p>

          {/* Navigation cards */}
          <div className="btn-group" style={styles.cardGrid}>

            <Link to="/report-lost" style={{ textDecoration: 'none' }}>
              <div
                className="nav-card"
                style={{ ...styles.card, '--card-shine': 'linear-gradient(135deg, rgba(249,115,22,0.12), transparent)' }}
              >
                <div style={{ ...styles.cardIcon, background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                  ＋
                </div>
                <div>
                  <p style={styles.cardTitle}>Report Lost Item</p>
                  <p style={styles.cardSub}>Submit a new report</p>
                </div>
                <span style={{ ...styles.cardArrow, color: '#f97316' }}>→</span>
              </div>
            </Link>

            <Link to="/lost-reports" style={{ textDecoration: 'none' }}>
              <div
                className="nav-card"
                style={{ ...styles.card, '--card-shine': 'linear-gradient(135deg, rgba(99,102,241,0.12), transparent)' }}
              >
                <div style={{ ...styles.cardIcon, background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  ≡
                </div>
                <div>
                  <p style={styles.cardTitle}>My Reports</p>
                  <p style={styles.cardSub}>Track your submissions</p>
                </div>
                <span style={{ ...styles.cardArrow, color: '#818cf8' }}>→</span>
              </div>
            </Link>

            <Link to="/admin/lost-items" style={{ textDecoration: 'none' }}>
              <div
                className="nav-card"
                style={{ ...styles.card, ...styles.cardAdmin, '--card-shine': 'linear-gradient(135deg, rgba(245,240,232,0.08), transparent)' }}
              >
                <div style={{ ...styles.cardIcon, background: 'rgba(245,240,232,0.12)', color: '#f5f0e8' }}>
                  ⬡
                </div>
                <div>
                  <p style={styles.cardTitle}>Admin Panel</p>
                  <p style={styles.cardSub}>Manage all reports</p>
                </div>
                <span style={{ ...styles.cardArrow, color: '#f5f0e8' }}>→</span>
              </div>
            </Link>

          </div>

          {/* Stats strip */}
          <div className="stat-chip" style={styles.statsRow}>
            {[
              { label: 'Items reported', value: '1,240+' },
              { label: 'Recovered', value: '860+' },
              { label: 'Recovery rate', value: '69%' },
            ].map((s) => (
              <div key={s.label} style={styles.statItem}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} UniFind · University Campus Services
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report-lost" element={<ReportLostItemPage />} />
      <Route path="/lost-reports" element={<MyLostReportsPage />} />
      <Route path="/lost-reports/:id" element={<LostItemDetailsPage />} />
      <Route path="/lost-reports/edit/:id" element={<EditLostItemPage />} />
      <Route path="/admin/lost-items" element={<AdminManageLostPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#0d0d0d',
    position: 'relative',
    overflow: 'hidden',
  },

  /* Background orbs */
  orb1: {
    position: 'fixed',
    width: '520px',
    height: '520px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
    top: '-160px',
    right: '-160px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb2: {
    background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
    top: 'auto',
    bottom: '-200px',
    right: 'auto',
    left: '-200px',
  },

  /* Nav */
  nav: {
    width: '100%',
    maxWidth: '820px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 20px 0',
    position: 'relative',
    zIndex: 10,
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#f97316',
    display: 'inline-block',
  },
  navName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 900,
    fontSize: '20px',
    color: '#f5f0e8',
    letterSpacing: '-0.3px',
  },
  navTagline: {
    fontSize: '12px',
    color: 'rgba(245,240,232,0.35)',
    letterSpacing: '0.05em',
    fontWeight: 500,
    textTransform: 'uppercase',
  },

  /* Main */
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 5,
  },

  heroCard: {
    width: '100%',
    maxWidth: '760px',
  },

  eyebrow: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.18em',
    color: '#f97316',
    marginBottom: '18px',
  },

  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(44px, 8vw, 72px)',
    fontWeight: 900,
    lineHeight: 1.05,
    color: '#f5f0e8',
    marginBottom: '24px',
    letterSpacing: '-1.5px',
  },
  titleAccent: {
    color: '#f97316',
  },

  divider: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #f97316, rgba(249,115,22,0))',
    borderRadius: '2px',
    marginBottom: '24px',
  },

  desc: {
    fontSize: '16px',
    lineHeight: '1.75',
    color: 'rgba(245,240,232,0.55)',
    maxWidth: '460px',
    marginBottom: '44px',
    fontWeight: 300,
  },

  /* Navigation cards */
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '14px',
    marginBottom: '44px',
  },

  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  cardAdmin: {
    border: '1px solid rgba(245,240,232,0.12)',
  },

  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },

  cardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#f5f0e8',
    marginBottom: '3px',
  },
  cardSub: {
    fontSize: '12px',
    color: 'rgba(245,240,232,0.4)',
    fontWeight: 400,
  },

  cardArrow: {
    marginLeft: 'auto',
    fontSize: '18px',
    flexShrink: 0,
    opacity: 0.7,
  },

  /* Stats */
  statsRow: {
    display: 'flex',
    gap: '32px',
    paddingTop: '28px',
    borderTop: '1px solid rgba(245,240,232,0.08)',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#f5f0e8',
    letterSpacing: '-0.5px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(245,240,232,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
  },

  /* Footer */
  footer: {
    padding: '20px',
    fontSize: '12px',
    color: 'rgba(245,240,232,0.2)',
    letterSpacing: '0.04em',
    position: 'relative',
    zIndex: 5,
  },
};

export default App;