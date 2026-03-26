import { Routes, Route, Link, Navigate } from "react-router-dom";
import ReportLostItemPage from "./pages/user/ReportLostItemPage.jsx";
import MyLostReportsPage from "./pages/user/MyLostReportsPage.jsx";
import LostItemDetailsPage from "./pages/user/LostItemDetailsPage.jsx";
import EditLostItemPage from "./pages/user/EditLostItemPage.jsx";
import AdminManageLostPage from "./pages/admin/AdminManageLostPage.jsx";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f8f4ef 0%, #fffaf5 45%, #f4ede4 100%);
    color: #111827;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes floatSoft {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.10); }
    50% { box-shadow: 0 0 0 12px rgba(249,115,22,0.02); }
  }

  .fade-1 { animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .fade-2 { animation: fadeUp 0.65s 0.10s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .fade-3 { animation: fadeUp 0.65s 0.18s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .fade-4 { animation: fadeUp 0.65s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .fade-5 { animation: fadeUp 0.65s 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }

  .action-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  }

  .action-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.55), transparent 55%);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  .action-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
    border-color: rgba(249,115,22,0.18);
  }

  .action-card:hover::before {
    opacity: 1;
  }

  .action-card:hover .action-arrow {
    transform: translateX(4px);
  }

  .action-arrow {
    transition: transform 0.25s ease;
  }

  .visual-float {
    animation: floatSoft 5.5s ease-in-out infinite;
  }

  .glow-pulse {
    animation: pulseGlow 4s ease-in-out infinite;
  }

  @media (max-width: 1080px) {
    .hero-grid {
      grid-template-columns: 1fr !important;
      gap: 28px !important;
    }

    .top-nav-inner {
      padding: 14px 16px !important;
    }

    .visual-wrap {
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
    }
  }

  @media (max-width: 768px) {
    .top-nav-inner {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 12px;
    }

    .top-right-group {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .hero-shell {
      padding: 24px !important;
      border-radius: 26px !important;
    }

    .action-grid {
      grid-template-columns: 1fr !important;
    }

    .stats-grid {
      grid-template-columns: 1fr !important;
    }

    .title-line-break {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .brand-name {
      font-size: 22px !important;
    }

    .hero-title {
      font-size: clamp(38px, 11vw, 58px) !important;
      line-height: 1.02 !important;
    }

    .visual-panel {
      padding: 18px !important;
    }

    .preview-card {
      padding: 14px !important;
    }
  }
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: globalStyles }} />;
}

function HomePage() {
  const actions = [
    {
      title: "Report Lost Item",
      sub: "Submit a new lost item report",
      icon: "＋",
      accent: "#f97316",
      soft: "rgba(249,115,22,0.12)",
      to: "/report-lost",
      tag: "Student",
    },
    {
      title: "My Reports",
      sub: "Check status and update reports",
      icon: "≡",
      accent: "#6366f1",
      soft: "rgba(99,102,241,0.12)",
      to: "/lost-reports",
      tag: "Tracking",
    },
    {
      title: "Admin Panel",
      sub: "Manage all campus lost item records",
      icon: "⬡",
      accent: "#0f172a",
      soft: "rgba(15,23,42,0.08)",
      to: "/admin/lost-items",
      tag: "Staff",
    },
  ];

  const stats = [
    { value: "1,240+", label: "Items Reported" },
    { value: "860+", label: "Recovered" },
    { value: "69%", label: "Recovery Rate" },
  ];

  return (
    <div style={styles.page}>
      <StyleInjector />

      <div style={styles.bgOrbTop} />
      <div style={styles.bgOrbBottom} />
      <div style={styles.gridOverlay} />

      <nav style={styles.nav}>
        <div className="top-nav-inner fade-1" style={styles.navInner}>
          <div style={styles.navLeft}>
            <div style={styles.brandMarkWrap}>
              <span style={styles.brandMarkDot} />
            </div>
            <div>
              <div className="brand-name" style={styles.brandName}>UniFind</div>
              <div style={styles.brandSub}>University Lost & Found Portal</div>
            </div>
          </div>

          <div className="top-right-group" style={styles.navRight}>
            <span style={styles.navPill}>Student Portal</span>
            <span style={styles.navMiniInfo}>Fast reporting · better recovery</span>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <section className="hero-shell" style={styles.heroShell}>
          <div className="hero-grid" style={styles.heroGrid}>
            <div style={styles.leftCol}>
              <div className="fade-2" style={styles.heroBadge}>
                SIMPLE · FAST · CAMPUS SAFE
              </div>

              <h1 className="hero-title fade-3" style={styles.title}>
                Lost something
                <span className="title-line-break"><br /></span>
                <span style={styles.titleAccent}> on campus?</span>
              </h1>

              <p className="fade-4" style={styles.desc}>
                Report lost items, track your submissions, and connect with
                campus staff through one clean platform built for university use.
              </p>

              <div className="action-grid fade-5" style={styles.cardGrid}>
                {actions.map((item) => (
                  <Link key={item.title} to={item.to} style={styles.linkReset}>
                    <div className="action-card" style={styles.card}>
                      <div style={{ ...styles.cardTopLine, background: item.accent }} />
                      <div
                        style={{
                          ...styles.cardIcon,
                          background: item.soft,
                          color: item.accent,
                        }}
                      >
                        {item.icon}
                      </div>

                      <div style={styles.cardContent}>
                        <div style={styles.cardTag}>{item.tag}</div>
                        <div style={styles.cardTitle}>{item.title}</div>
                        <div style={styles.cardSub}>{item.sub}</div>
                      </div>

                      <div className="action-arrow" style={{ ...styles.cardArrow, color: item.accent }}>
                        →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="stats-grid fade-5" style={styles.statsRow}>
                {stats.map((item) => (
                  <div key={item.label} style={styles.statCard}>
                    <div style={styles.statValue}>{item.value}</div>
                    <div style={styles.statLabel}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="visual-wrap fade-4" style={styles.rightCol}>
              <div className="visual-panel glow-pulse" style={styles.visualPanel}>
                <div style={styles.visualTop}>
                  <div>
                    <div style={styles.visualEyebrow}>Smart Lost Item Preview</div>
                    <div style={styles.visualTitle}>Helping students recover faster</div>
                  </div>
                  <div style={styles.visualStatus}>Live</div>
                </div>

                <div className="visual-float" style={styles.heroIllustration}>
                  <div style={styles.bigCircle}>
                    <div style={styles.bigCircleInner}>🎒</div>
                  </div>

                  <div style={styles.floatingChip1}>Laptop</div>
                  <div style={styles.floatingChip2}>Wallet</div>
                  <div style={styles.floatingChip3}>ID Card</div>
                </div>

                <div style={styles.previewStack}>
                  <div className="preview-card" style={styles.previewCardMain}>
                    <div style={styles.previewIcon}>📱</div>
                    <div style={styles.previewTextWrap}>
                      <div style={styles.previewTitle}>Black iPhone</div>
                      <div style={styles.previewSub}>Library · 2 hours ago</div>
                    </div>
                    <div style={styles.previewBadgeFound}>Matched</div>
                  </div>

                  <div className="preview-card" style={styles.previewCard}>
                    <div style={styles.previewIconAlt}>🪪</div>
                    <div style={styles.previewTextWrap}>
                      <div style={styles.previewTitle}>Student ID Card</div>
                      <div style={styles.previewSub}>Main Hall · Yesterday</div>
                    </div>
                    <div style={styles.previewBadge}>Open</div>
                  </div>

                  <div className="preview-card" style={styles.previewCard}>
                    <div style={styles.previewIconAlt2}>💼</div>
                    <div style={styles.previewTextWrap}>
                      <div style={styles.previewTitle}>Laptop Bag</div>
                      <div style={styles.previewSub}>Cafeteria · Today</div>
                    </div>
                    <div style={styles.previewBadge}>Review</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #f8f4ef 0%, #fffaf5 45%, #f4ede4 100%)",
  },

  bgOrbTop: {
    position: "fixed",
    top: "-140px",
    right: "-120px",
    width: "460px",
    height: "460px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(249,115,22,0.06) 40%, transparent 72%)",
    filter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 0,
  },

  bgOrbBottom: {
    position: "fixed",
    bottom: "-180px",
    left: "-140px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(99,102,241,0.04) 40%, transparent 72%)",
    filter: "blur(14px)",
    pointerEvents: "none",
    zIndex: 0,
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    maskImage:
      "radial-gradient(circle at center, rgba(0,0,0,0.9), rgba(0,0,0,0.25) 70%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  nav: {
    position: "relative",
    zIndex: 2,
    padding: "28px 20px 0",
  },

  navInner: {
    maxWidth: "1240px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.62)",
    border: "1px solid rgba(255,255,255,0.75)",
    boxShadow: "0 14px 40px rgba(15,23,42,0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  brandMarkWrap: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #fff1e7, #ffffff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 18px rgba(249,115,22,0.14)",
  },

  brandMarkDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f59e0b, #f97316)",
  },

  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px",
    fontWeight: 800,
    lineHeight: 1,
    color: "#111827",
    letterSpacing: "-0.5px",
  },

  brandSub: {
    marginTop: "4px",
    fontSize: "12px",
    color: "rgba(17,24,39,0.58)",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  navPill: {
    padding: "10px 16px",
    borderRadius: "999px",
    background: "rgba(249,115,22,0.12)",
    color: "#c2410c",
    border: "1px solid rgba(249,115,22,0.18)",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  navMiniInfo: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(15,23,42,0.06)",
    color: "rgba(17,24,39,0.68)",
    fontSize: "13px",
    fontWeight: 600,
  },

  main: {
    position: "relative",
    zIndex: 2,
    padding: "26px 20px 30px",
  },

  heroShell: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "34px",
    borderRadius: "34px",
    background: "rgba(255,255,255,0.58)",
    border: "1px solid rgba(255,255,255,0.78)",
    boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "38px",
    alignItems: "center",
  },

  leftCol: {
    minWidth: 0,
  },

  rightCol: {
    minWidth: 0,
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "18px",
    padding: "9px 16px",
    borderRadius: "999px",
    background: "rgba(249,115,22,0.10)",
    color: "#f97316",
    border: "1px solid rgba(249,115,22,0.14)",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },

  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(54px, 7.5vw, 82px)",
    lineHeight: 0.96,
    letterSpacing: "-2px",
    color: "#0f172a",
    marginBottom: "18px",
  },

  titleAccent: {
    color: "#f97316",
  },

  desc: {
    maxWidth: "620px",
    fontSize: "18px",
    lineHeight: 1.8,
    color: "rgba(17,24,39,0.68)",
    marginBottom: "32px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  linkReset: {
    textDecoration: "none",
  },

  card: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px 18px",
    minHeight: "122px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 12px 26px rgba(15,23,42,0.05)",
  },

  cardTopLine: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: "4px",
    borderRadius: "0 0 10px 10px",
  },

  cardIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: 800,
    flexShrink: 0,
  },

  cardContent: {
    minWidth: 0,
  },

  cardTag: {
    display: "inline-flex",
    marginBottom: "8px",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.05)",
    color: "rgba(17,24,39,0.62)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  cardTitle: {
    fontSize: "17px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "5px",
  },

  cardSub: {
    fontSize: "13px",
    lineHeight: 1.55,
    color: "rgba(17,24,39,0.58)",
    maxWidth: "185px",
  },

  cardArrow: {
    marginLeft: "auto",
    fontSize: "22px",
    fontWeight: 700,
    flexShrink: 0,
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },

  statCard: {
    padding: "18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 18px rgba(15,23,42,0.04)",
  },

  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "34px",
    fontWeight: 800,
    lineHeight: 1,
    color: "#0f172a",
    marginBottom: "8px",
    letterSpacing: "-1px",
  },

  statLabel: {
    fontSize: "12px",
    color: "rgba(17,24,39,0.58)",
    fontWeight: 700,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
  },

  visualPanel: {
    position: "relative",
    padding: "22px",
    borderRadius: "30px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.78))",
    border: "1px solid rgba(255,255,255,0.82)",
    boxShadow: "0 24px 56px rgba(15,23,42,0.10)",
  },

  visualTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },

  visualEyebrow: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#f97316",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    marginBottom: "6px",
  },

  visualTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.25,
    maxWidth: "280px",
  },

  visualStatus: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.10)",
    color: "#047857",
    fontSize: "12px",
    fontWeight: 800,
    border: "1px solid rgba(16,185,129,0.18)",
  },

  heroIllustration: {
    position: "relative",
    height: "220px",
    marginBottom: "20px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #fff7ef 0%, #f8f5ff 100%)",
    border: "1px solid rgba(15,23,42,0.06)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  bigCircle: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f97316, #fb923c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 24px 40px rgba(249,115,22,0.24)",
  },

  bigCircleInner: {
    width: "104px",
    height: "104px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
  },

  floatingChip1: {
    position: "absolute",
    top: "22px",
    left: "20px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f172a",
  },

  floatingChip2: {
    position: "absolute",
    right: "20px",
    top: "56px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f172a",
  },

  floatingChip3: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f172a",
  },

  previewStack: {
    display: "grid",
    gap: "12px",
  },

  previewCardMain: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #fff7ef, #ffffff)",
    border: "1px solid rgba(249,115,22,0.14)",
    boxShadow: "0 12px 24px rgba(249,115,22,0.10)",
  },

  previewCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(15,23,42,0.06)",
  },

  previewIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(249,115,22,0.12)",
    fontSize: "22px",
    flexShrink: 0,
  },

  previewIconAlt: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(99,102,241,0.10)",
    fontSize: "22px",
    flexShrink: 0,
  },

  previewIconAlt2: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15,23,42,0.06)",
    fontSize: "22px",
    flexShrink: 0,
  },

  previewTextWrap: {
    minWidth: 0,
    flex: 1,
  },

  previewTitle: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "4px",
  },

  previewSub: {
    fontSize: "12px",
    color: "rgba(17,24,39,0.56)",
    fontWeight: 600,
  },

  previewBadgeFound: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.10)",
    color: "#047857",
    fontSize: "11px",
    fontWeight: 800,
    border: "1px solid rgba(16,185,129,0.18)",
    flexShrink: 0,
  },

  previewBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.06)",
    color: "rgba(17,24,39,0.72)",
    fontSize: "11px",
    fontWeight: 800,
    border: "1px solid rgba(15,23,42,0.08)",
    flexShrink: 0,
  },

  footer: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "12px 20px 26px",
    color: "rgba(17,24,39,0.46)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
};

export default App;