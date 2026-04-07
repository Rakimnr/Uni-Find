import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLostItems } from "../../api/lostApi.js";

import campusHero from "../../assets/campus-hero.jpg";
import campusLibrary from "../../assets/campus-library.jpg";
import campusStudents from "../../assets/campus-students.jpg";
import campusBuilding from "../../assets/campus-building.jpg";

function HomeBrowsePage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sampleItems = [
    {
      _id: "1",
      title: "Student ID Card",
      category: "Documents",
      lostLocation: "Main Library",
      dateLost: "2026-03-23",
      status: "open",
    },
    {
      _id: "2",
      title: "Blue Backpack",
      category: "Accessories",
      lostLocation: "Lecture Hall A",
      dateLost: "2026-03-21",
      status: "open",
    },
    {
      _id: "3",
      title: "iPhone Black Cover",
      category: "Electronics",
      lostLocation: "Cafeteria",
      dateLost: "2026-03-20",
      status: "possible_match",
    },
    {
      _id: "4",
      title: "Water Bottle",
      category: "Other",
      lostLocation: "Student Center",
      dateLost: "2026-03-18",
      status: "closed",
    },
  ];

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const result = await getLostItems();
        const data = result?.data || result;

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(sampleItems);
        }
      } catch (err) {
        setItems(sampleItems);
        setError("Unable to load live data right now. Showing preview data.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const open = items.filter((item) => item.status === "open").length;
    const possible = items.filter((item) => item.status === "possible_match").length;
    const returned = items.filter((item) => item.status === "closed").length;

    return { total, open, possible, returned };
  }, [items]);

  const recentItems = useMemo(() => {
    return [...items].slice(0, 6);
  }, [items]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>Loading homepage...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topTicker}>
        <div style={styles.tickerTrack}>
          {recentItems.length > 0
            ? [...recentItems, ...recentItems].map((item, index) => (
                <span key={`${item._id}-${index}`} style={styles.tickerItem}>
                  {item.title} • {item.lostLocation}
                </span>
              ))
            : null}
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoBox} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}>U</div>
            <div>
              <h1 style={styles.logoText}>UniFind</h1>
              <p style={styles.logoSub}>University Lost & Found Portal</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <button style={styles.activeNavButton}>Lost Items</button>

            <button
              style={styles.navButton}
              onClick={() => navigate("/found-items")}
            >
              Found Portal
            </button>

            <button
              style={styles.navButton}
              onClick={() => navigate("/lost-reports")}
            >
              My Reports
            </button>
          </nav>

          <div style={styles.headerActions}>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              style={styles.primaryButton}
              onClick={() => navigate("/report-lost")}
            >
              + Report Lost
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>Smart campus lost & found</div>

            <h2 style={styles.heroTitle}>
              Recover lost belongings in a simpler, safer, more student-friendly way.
            </h2>

            <p style={styles.heroText}>
              UniFind helps students and staff report lost items, browse possible
              matches, and manage recovery in one clean university portal. It is
              designed to reduce confusion and make item tracking easier on campus.
            </p>

            <div style={styles.heroButtons}>
              <button
                style={styles.primaryLargeButton}
                onClick={() => navigate("/report-lost")}
              >
                Report Lost Item
              </button>

              <button
                style={styles.outlineLargeButton}
                onClick={() => navigate("/found-items")}
              >
                Browse Found Items
              </button>
            </div>
          </div>

          <div style={styles.heroImageWrap}>
            <img src={campusHero} alt="University campus" style={styles.heroImage} />
          </div>
        </section>

        {error ? <div style={styles.notice}>{error}</div> : null}

        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Reports</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.open}</div>
            <div style={styles.statLabel}>Open Reports</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.possible}</div>
            <div style={styles.statLabel}>Possible Matches</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.returned}</div>
            <div style={styles.statLabel}>Returned Items</div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionTag}>Why UniFind</p>
              <h3 style={styles.sectionTitle}>Made for real campus use</h3>
            </div>
          </div>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📝</div>
              <h4 style={styles.featureTitle}>Easy reporting</h4>
              <p style={styles.featureText}>
                Students can create lost item reports quickly with clear details,
                locations, dates, and descriptions.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔎</div>
              <h4 style={styles.featureTitle}>Smart browsing</h4>
              <p style={styles.featureText}>
                Browse item lists clearly and identify possible matches faster
                using simple, organized pages.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🛡️</div>
              <h4 style={styles.featureTitle}>Safer verification</h4>
              <p style={styles.featureText}>
                Stronger descriptions and item details help reduce false claims
                and improve trust during recovery.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤝</div>
              <h4 style={styles.featureTitle}>Student-friendly process</h4>
              <p style={styles.featureText}>
                A more structured portal is easier than random chats, notices,
                or searching manually around campus.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionTag}>Campus view</p>
              <h3 style={styles.sectionTitle}>University life, beautifully presented</h3>
            </div>
          </div>

          <div style={styles.imageGrid}>
            <div style={styles.imageCard}>
              <img src={campusLibrary} alt="Campus library" style={styles.gridImage} />
              <div style={styles.imageCaption}>Library and study spaces</div>
            </div>

            <div style={styles.imageCard}>
              <img src={campusStudents} alt="Students on campus" style={styles.gridImage} />
              <div style={styles.imageCaption}>Student-friendly environment</div>
            </div>

            <div style={styles.imageCard}>
              <img src={campusBuilding} alt="University building" style={styles.gridImage} />
              <div style={styles.imageCaption}>Safe and organized campus support</div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionTag}>Recent reports</p>
              <h3 style={styles.sectionTitle}>Latest lost item activity</h3>
            </div>
          </div>

          <div style={styles.reportGrid}>
            {recentItems.map((item) => (
              <div key={item._id} style={styles.reportCard}>
                <div style={styles.reportTop}>
                  <span style={styles.reportCategory}>{item.category}</span>
                  <span style={styles.reportStatus}>{item.status}</span>
                </div>

                <h4 style={styles.reportTitle}>{item.title}</h4>

                <p style={styles.reportMeta}>
                  Location: {item.lostLocation}
                </p>

                <p style={styles.reportMeta}>
                  Date: {formatDate(item.dateLost)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionTag}>How it works</p>
              <h3 style={styles.sectionTitle}>Simple recovery process</h3>
            </div>
          </div>

          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h4 style={styles.stepTitle}>Report the item</h4>
              <p style={styles.stepText}>
                Add the name, date, place, and special features of the lost item.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h4 style={styles.stepTitle}>Browse matching records</h4>
              <p style={styles.stepText}>
                Check found items and compare with your report details.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h4 style={styles.stepTitle}>Verify ownership</h4>
              <p style={styles.stepText}>
                Provide item-specific details to confirm the rightful owner.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <h4 style={styles.stepTitle}>Receive the item</h4>
              <p style={styles.stepText}>
                Once approved, the item can be returned safely through the process.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.faqSection}>
          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionTag}>FAQ</p>
              <h3 style={styles.sectionTitle}>Common questions</h3>
            </div>
          </div>

          <div style={styles.faqGrid}>
            <div style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>How do I report a lost item?</h4>
              <p style={styles.faqAnswer}>
                Use the Report Lost button and provide clear item details such as
                name, location, date, and identifying features.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>Can I manage my reports later?</h4>
              <p style={styles.faqAnswer}>
                Yes. You can open My Reports and review or update your lost item
                information later.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>Where can I browse found items?</h4>
              <p style={styles.faqAnswer}>
                Use the Found Portal button on the top navigation to open the
                found items section.
              </p>
            </div>

            <div style={styles.faqCard}>
              <h4 style={styles.faqQuestion}>Why is this useful for our university?</h4>
              <p style={styles.faqAnswer}>
                It gives students and staff one proper digital place to report,
                browse, and track lost-and-found activity.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Lost something important on campus?</h3>
          <p style={styles.ctaText}>
            Create a report now and let the university community help you recover it faster.
          </p>

          <div style={styles.ctaButtons}>
            <button
              style={styles.primaryLargeButton}
              onClick={() => navigate("/report-lost")}
            >
              Create Lost Report
            </button>

            <button
              style={styles.outlineDarkButton}
              onClick={() => navigate("/found-items")}
            >
              Check Found Portal
            </button>
          </div>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerLogo}>UniFind</h3>
            <p style={styles.footerText}>
              A cleaner university lost & found experience for students and staff.
            </p>
          </div>

          <div style={styles.footerLinks}>
            <button style={styles.footerLink} onClick={() => navigate("/report-lost")}>
              Report Lost Item
            </button>
            <button style={styles.footerLink} onClick={() => navigate("/found-items")}>
              Found Portal
            </button>
            <button style={styles.footerLink} onClick={() => navigate("/lost-reports")}>
              My Reports
            </button>
          </div>

          <div style={styles.footerBottom}>
            © 2026 UniFind • University Lost & Found Portal
          </div>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5ef",
    color: "#2d1f12",
    fontFamily: "Arial, sans-serif",
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f5ef",
  },
  loadingBox: {
    background: "#fff",
    padding: "20px 28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    fontWeight: "600",
  },
  topTicker: {
    background: "#b96a09",
    color: "#fff",
    overflow: "hidden",
    whiteSpace: "nowrap",
    padding: "10px 0",
  },
  tickerTrack: {
    display: "inline-block",
    minWidth: "200%",
    animation: "ticker 26s linear infinite",
  },
  tickerItem: {
    marginRight: "36px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(248,245,239,0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #eadfcf",
  },
  headerInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "#d67b10",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "24px",
  },
  logoText: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
  },
  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#7a6652",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f3eadc",
    padding: "6px",
    borderRadius: "999px",
    border: "1px solid #eadfcf",
    flexWrap: "wrap",
  },
  navButton: {
    border: "none",
    background: "transparent",
    color: "#5d4734",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  activeNavButton: {
    border: "none",
    background: "linear-gradient(135deg, #c86f10, #e49a2e)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    border: "1px solid #d8c6b1",
    background: "#fff",
    color: "#5d4734",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #c86f10, #e49a2e)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 10px 25px rgba(214,123,16,0.25)",
  },
  main: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "28px 24px 50px",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "28px",
    alignItems: "center",
    background: "#fdfaf5",
    border: "1px solid #eadfcf",
    borderRadius: "32px",
    padding: "34px",
    boxShadow: "0 14px 40px rgba(0,0,0,0.05)",
  },
  heroContent: {
    display: "flex",
    flexDirection: "column",
  },
  heroBadge: {
    display: "inline-block",
    background: "#fff1dc",
    color: "#c86f10",
    border: "1px solid #f0d4ad",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    width: "fit-content",
  },
  heroTitle: {
    fontSize: "56px",
    lineHeight: 1.08,
    margin: "18px 0 0 0",
    fontWeight: "800",
  },
  heroText: {
    marginTop: "18px",
    fontSize: "18px",
    lineHeight: 1.8,
    color: "#6f5b47",
    maxWidth: "700px",
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  primaryLargeButton: {
    border: "none",
    background: "linear-gradient(135deg, #c86f10, #e49a2e)",
    color: "#fff",
    padding: "15px 24px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 10px 25px rgba(214,123,16,0.25)",
  },
  outlineLargeButton: {
    border: "1px solid #d8c6b1",
    background: "#fff",
    color: "#5d4734",
    padding: "15px 24px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  heroImageWrap: {
    height: "100%",
    minHeight: "420px",
    borderRadius: "26px",
    overflow: "hidden",
    background: "#efe5d7",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  notice: {
    marginTop: "18px",
    background: "#fff7ec",
    color: "#8a5b1f",
    border: "1px solid #f0d4ad",
    borderRadius: "16px",
    padding: "14px 18px",
    fontWeight: "600",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginTop: "28px",
  },
  statCard: {
    background: "#fff",
    border: "1px solid #eadfcf",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  statNumber: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#d67b10",
  },
  statLabel: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#6f5b47",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  section: {
    marginTop: "38px",
  },
  sectionHeader: {
    marginBottom: "18px",
  },
  sectionTag: {
    margin: 0,
    color: "#c86f10",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "12px",
  },
  sectionTitle: {
    margin: "8px 0 0 0",
    fontSize: "34px",
    fontWeight: "800",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #eadfcf",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  featureIcon: {
    fontSize: "30px",
    marginBottom: "12px",
  },
  featureTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },
  featureText: {
    marginTop: "10px",
    lineHeight: 1.7,
    color: "#6f5b47",
    fontSize: "15px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  imageCard: {
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid #eadfcf",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  gridImage: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
  },
  imageCaption: {
    padding: "16px 18px",
    fontWeight: "700",
    color: "#4a3828",
  },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  reportCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "20px",
    border: "1px solid #eadfcf",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  reportTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  reportCategory: {
    background: "#fff1dc",
    color: "#c86f10",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  reportStatus: {
    background: "#f2efe9",
    color: "#6f5b47",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  reportTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },
  reportMeta: {
    margin: "8px 0 0 0",
    color: "#6f5b47",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },
  stepCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #eadfcf",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  stepNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#d67b10",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "14px",
  },
  stepTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
  },
  stepText: {
    marginTop: "10px",
    color: "#6f5b47",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  faqSection: {
    marginTop: "38px",
  },
  faqGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px",
  },
  faqCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #eadfcf",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },
  faqQuestion: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
  },
  faqAnswer: {
    marginTop: "10px",
    color: "#6f5b47",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  ctaSection: {
    marginTop: "40px",
    background: "linear-gradient(135deg, #2d1f12, #5f4227)",
    borderRadius: "30px",
    padding: "40px 28px",
    textAlign: "center",
    color: "#fff",
  },
  ctaTitle: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800",
  },
  ctaText: {
    margin: "14px auto 0",
    maxWidth: "700px",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.82)",
    fontSize: "16px",
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  outlineDarkButton: {
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "#fff",
    padding: "15px 24px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  footer: {
    marginTop: "40px",
    paddingTop: "30px",
    borderTop: "1px solid #eadfcf",
  },
  footerBrand: {
    textAlign: "center",
  },
  footerLogo: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },
  footerText: {
    marginTop: "10px",
    color: "#6f5b47",
    lineHeight: 1.7,
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  footerLink: {
    border: "none",
    background: "transparent",
    color: "#6f5b47",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  footerBottom: {
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #f0e6d8",
    color: "#8a7764",
    fontSize: "13px",
  },
};
export default HomeBrowsePage;