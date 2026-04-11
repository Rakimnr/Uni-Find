import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLostItems } from "../../api/lostApi.js";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

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
      image: "",
    },
    {
      _id: "2",
      title: "Blue Backpack",
      category: "Accessories",
      lostLocation: "Lecture Hall A",
      dateLost: "2026-03-21",
      status: "open",
      image: "",
    },
    {
      _id: "3",
      title: "iPhone Black Cover",
      category: "Electronics",
      lostLocation: "Cafeteria",
      dateLost: "2026-03-20",
      status: "possible_match",
      image: "",
    },
    {
      _id: "4",
      title: "Water Bottle",
      category: "Other",
      lostLocation: "Student Center",
      dateLost: "2026-03-18",
      status: "closed",
      image: "",
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

  const recentItems = useMemo(() => {
    return [...items].slice(0, 6);
  }, [items]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "Open";
      case "possible_match":
        return "Possible Match";
      case "closed":
        return "Returned";
      case "under_review":
        return "Under Review";
      default:
        return status || "Unknown";
    }
  };

  const getItemImageUrl = (item) => {
    if (!item?.image) return "";
    if (item.image.startsWith("http")) return item.image;
    return `http://localhost:5001${item.image}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <span>Loading homepage...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar active="home" />

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <div style={styles.heroGlowOne}></div>
          <div style={styles.heroGlowTwo}></div>

          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>Smart Campus Lost & Found Platform</div>

            <h1 style={styles.heroTitle}>
              Find What Matters With A Cleaner And Smarter Campus Experience.
            </h1>

            <p style={styles.heroText}>
              UniFind helps students and staff report missing belongings, browse
              possible matches, and recover items through one modern and
              trusted university platform.
            </p>

            <div style={styles.heroButtons}>
              <button
                type="button"
                style={styles.primaryLargeButton}
                onClick={() => navigate("/report-lost")}
              >
                Report Lost Item
              </button>

              <button
                type="button"
                style={styles.secondaryLargeButton}
                onClick={() => navigate("/found-items")}
              >
                Browse Found Items
              </button>
            </div>

            <div style={styles.heroStatsRow}>
              <div style={styles.heroStatCard}>
                <h3 style={styles.heroStatNumber}>24/7</h3>
                <p style={styles.heroStatLabel}>Accessible online portal</p>
              </div>

              <div style={styles.heroStatCard}>
                <h3 style={styles.heroStatNumber}>Fast</h3>
                <p style={styles.heroStatLabel}>Simple reports and matching</p>
              </div>

              <div style={styles.heroStatCard}>
                <h3 style={styles.heroStatNumber}>Safe</h3>
                <p style={styles.heroStatLabel}>Ownership verification flow</p>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.heroImageCard}>
              <img src={campusHero} alt="University campus" style={styles.heroImage} />

              <div style={styles.heroFloatingCardTop}>
                <span style={styles.heroFloatingLabel}>Trusted Campus Service</span>
                <strong>Report, track, recover</strong>
              </div>

              <div style={styles.heroFloatingCardBottom}>
                <div style={styles.heroMiniDot}></div>
                <span>Helping students reconnect with their belongings</span>
              </div>
            </div>
          </div>
        </section>

        {error ? <div style={styles.notice}>{error}</div> : null}

        <section style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <div>
              <p style={styles.sectionTag}>Why UniFind</p>
              <h2 style={styles.sectionTitle}>Designed For Real Campus Life</h2>
            </div>
            <p style={styles.sectionSubText}>
              A polished and student-friendly experience for reporting, browsing,
              and recovering lost items.
            </p>
          </div>

          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrap}>📝</div>
              <h3 style={styles.featureTitle}>Quick reporting</h3>
              <p style={styles.featureText}>
                Submit lost item reports with category, date, place, and unique
                item details in one clean flow.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrap}>🔎</div>
              <h3 style={styles.featureTitle}>Easy browsing</h3>
              <p style={styles.featureText}>
                Explore recent item reports in a better organized interface to
                identify likely matches faster.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrap}>🛡️</div>
              <h3 style={styles.featureTitle}>Safer verification</h3>
              <p style={styles.featureText}>
                Stronger claim details help staff confirm rightful ownership and
                reduce false claims.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrap}>📍</div>
              <h3 style={styles.featureTitle}>Campus-focused system</h3>
              <p style={styles.featureText}>
                Built for universities where items are often lost in lecture
                halls, libraries, cafeterias, and common spaces.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.showcaseSection}>
            <div style={styles.showcaseTextSide}>
              <p style={styles.sectionTag}>Campus Experience</p>
              <h2 style={styles.sectionTitle}>A Homepage That Feels Modern</h2>
              <p style={styles.showcaseText}>
                This layout uses stronger spacing, premium cards, cleaner
                section flow, and better content balance so the homepage feels
                closer to a real-world product.
              </p>

              <div style={styles.showcaseChecklist}>
                <div style={styles.checkItem}>✓ Strong visual hierarchy</div>
                <div style={styles.checkItem}>✓ Better first impression</div>
                <div style={styles.checkItem}>✓ Cleaner section structure</div>
                <div style={styles.checkItem}>✓ More professional footer</div>
              </div>
            </div>

            <div style={styles.imageGrid}>
              <div style={styles.imageCardTall}>
                <img src={campusLibrary} alt="Campus library" style={styles.gridImageTall} />
                <div style={styles.imageOverlayLabel}>Libraries & study areas</div>
              </div>

              <div style={styles.imageCardSmall}>
                <img src={campusStudents} alt="Students on campus" style={styles.gridImageSmall} />
                <div style={styles.imageOverlayLabel}>Student-friendly design</div>
              </div>

              <div style={styles.imageCardSmall}>
                <img src={campusBuilding} alt="University building" style={styles.gridImageSmall} />
                <div style={styles.imageOverlayLabel}>Organized support system</div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <div>
              <p style={styles.sectionTag}>Recent Reports</p>
              <h2 style={styles.sectionTitle}>Latest Lost Item Activity</h2>
            </div>
            <button
              type="button"
              style={styles.viewAllButton}
              onClick={() => navigate("/lost-items")}
            >
              View All
            </button>
          </div>

          <div style={styles.reportGrid}>
            {recentItems.map((item) => {
              const imageUrl = getItemImageUrl(item);

              return (
                <div key={item._id} style={styles.reportCard}>
                  <div style={styles.reportImageWrap}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} style={styles.reportImage} />
                    ) : (
                      <div style={styles.reportImagePlaceholder}>No image uploaded</div>
                    )}

                    <div style={styles.reportImageOverlay}>
                      <span style={styles.reportCategory}>{item.category}</span>
                      <span style={styles.reportStatus}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>

                  <div style={styles.reportBody}>
                    <h3 style={styles.reportTitle}>{item.title}</h3>

                    <p style={styles.reportMeta}>
                      <strong>Location:</strong> {item.lostLocation}
                    </p>

                    <p style={styles.reportMeta}>
                      <strong>Date:</strong> {formatDate(item.dateLost)}
                    </p>

                    <button
                      type="button"
                      style={styles.reportActionButton}
                      onClick={() => navigate("/lost-items")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <div>
              <p style={styles.sectionTag}>How It Works</p>
              <h2 style={styles.sectionTitle}>Simple Recovery Journey</h2>
            </div>
          </div>

          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Report the item</h3>
              <p style={styles.stepText}>
                Add the item name, location, date, and identifying details.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Browse possible matches</h3>
              <p style={styles.stepText}>
                Check recent reports and found item records across campus.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Verify ownership</h3>
              <p style={styles.stepText}>
                Provide unique item details so the return process stays safe.
              </p>
            </div>

            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <h3 style={styles.stepTitle}>Recover successfully</h3>
              <p style={styles.stepText}>
                Once approved, the item is returned through the proper process.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.faqShell}>
            <div style={styles.faqLeft}>
              <p style={styles.sectionTag}>FAQ</p>
              <h2 style={styles.sectionTitle}>Common questions</h2>
              <p style={styles.showcaseText}>
                Helpful information for students and staff using the platform.
              </p>
            </div>

            <div style={styles.faqGrid}>
              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>How do I report a lost item?</h3>
                <p style={styles.faqAnswer}>
                  Click the report button and enter the item details, lost
                  location, date, and special identifying features.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Can I review my reports later?</h3>
                <p style={styles.faqAnswer}>
                  Yes. Your submitted reports can be managed later through the
                  user side of the system.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Where can I browse found items?</h3>
                <p style={styles.faqAnswer}>
                  Use the Found Items page from the navigation bar to explore
                  the available found item list.
                </p>
              </div>

              <div style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>Why is UniFind useful?</h3>
                <p style={styles.faqAnswer}>
                  It gives the university one organized place to report, browse,
                  verify, and recover lost belongings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <p style={styles.ctaMini}>Start now</p>
            <h2 style={styles.ctaTitle}>Lost something important on campus?</h2>
            <p style={styles.ctaText}>
              Create a report now and let the university community help you
              recover it faster with a cleaner and safer process.
            </p>

            <div style={styles.ctaButtons}>
              <button
                type="button"
                style={styles.ctaPrimaryButton}
                onClick={() => navigate("/report-lost")}
              >
                Create Lost Report
              </button>

              <button
                type="button"
                style={styles.ctaOutlineButton}
                onClick={() => navigate("/found-items")}
              >
                Check Found Portal
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

const ORANGE = "#f97316";
const ORANGE_DARK = "#ea580c";
const ORANGE_SOFT = "#fff7ed";
const NAVY = "#0f172a";
const NAVY_LIGHT = "#1e293b";
const BORDER = "#e5e7eb";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const PAGE_BG = "#f8fafc";
const CARD_BG = "#ffffff";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #fff7ed 0%, #f8fafc 240px, #f8fafc 100%)",
    color: TEXT,
    fontFamily: "Arial, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PAGE_BG,
  },

  loadingCard: {
    backgroundColor: CARD_BG,
    padding: "18px 24px",
    borderRadius: "18px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    fontWeight: "700",
    color: TEXT,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  loadingSpinner: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    backgroundColor: ORANGE,
  },

  main: {
    maxWidth: "1380px",
    margin: "0 auto",
    padding: "34px 24px 70px",
  },

  heroSection: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: "28px",
    alignItems: "center",
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 45%, #ffffff 100%)",
    border: `1px solid rgba(249, 115, 22, 0.15)`,
    borderRadius: "32px",
    padding: "42px",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
  },

  heroGlowOne: {
    position: "absolute",
    top: "-80px",
    right: "-70px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(249, 115, 22, 0.10)",
    filter: "blur(20px)",
  },

  heroGlowTwo: {
    position: "absolute",
    bottom: "-80px",
    left: "-70px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "rgba(251, 146, 60, 0.10)",
    filter: "blur(20px)",
  },

  heroLeft: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
  },

  heroRight: {
    position: "relative",
    zIndex: 2,
  },

  heroBadge: {
    display: "inline-block",
    width: "fit-content",
    backgroundColor: "#ffffff",
    color: ORANGE,
    border: "1px solid #fed7aa",
    padding: "9px 15px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    boxShadow: "0 8px 18px rgba(249, 115, 22, 0.08)",
  },

  heroTitle: {
    fontSize: "62px",
    lineHeight: 1.02,
    margin: "22px 0 0 0",
    fontWeight: "800",
    letterSpacing: "-0.04em",
    color: NAVY,
    maxWidth: "760px",
  },

  heroText: {
    marginTop: "18px",
    fontSize: "18px",
    lineHeight: 1.85,
    color: MUTED,
    maxWidth: "690px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  primaryLargeButton: {
    border: "none",
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#ffffff",
    padding: "16px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 12px 24px rgba(249, 115, 22, 0.28)",
  },

  secondaryLargeButton: {
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: NAVY,
    padding: "16px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  },

  heroStatsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginTop: "30px",
  },

  heroStatCard: {
    background: "rgba(255, 255, 255, 0.86)",
    border: "1px solid #f1f5f9",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    backdropFilter: "blur(8px)",
  },

  heroStatNumber: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: ORANGE,
  },

  heroStatLabel: {
    margin: "8px 0 0 0",
    fontSize: "13px",
    lineHeight: 1.6,
    color: MUTED,
    fontWeight: "600",
  },

heroImageCard: {
  position: "relative",
  height: "520px",   
  borderRadius: "28px",
  overflow: "hidden",
  border: `1px solid ${BORDER}`,
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.10)",
  backgroundColor: "#e2e8f0",
},

heroImage: {
  position: "absolute",  
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
},

  heroFloatingCardTop: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: "14px 16px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: NAVY,
  },

  heroFloatingLabel: {
    fontSize: "12px",
    color: ORANGE,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  heroFloatingCardBottom: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    color: "#ffffff",
    padding: "14px 16px",
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "270px",
    lineHeight: 1.5,
    fontSize: "13px",
    fontWeight: "600",
  },

  heroMiniDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: ORANGE,
    flexShrink: 0,
  },

  notice: {
    marginTop: "18px",
    backgroundColor: ORANGE_SOFT,
    color: ORANGE_DARK,
    border: "1px solid #fed7aa",
    borderRadius: "16px",
    padding: "14px 18px",
    fontWeight: "600",
  },

  section: {
    marginTop: "50px",
  },

  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "20px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  sectionTag: {
    margin: 0,
    color: ORANGE,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "12px",
  },

  sectionTitle: {
    margin: "10px 0 0 0",
    fontSize: "38px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: NAVY,
    lineHeight: 1.1,
  },

  sectionSubText: {
    margin: 0,
    color: MUTED,
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "420px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  featureCard: {
    backgroundColor: CARD_BG,
    borderRadius: "24px",
    padding: "26px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.05)",
  },

  featureIconWrap: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    marginBottom: "16px",
    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.08)",
  },

  featureTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: NAVY,
  },

  featureText: {
    marginTop: "10px",
    lineHeight: 1.8,
    color: MUTED,
    fontSize: "14px",
  },

  showcaseSection: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "24px",
    alignItems: "stretch",
  },

  showcaseTextSide: {
    backgroundColor: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: "28px",
    padding: "30px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.05)",
  },

  showcaseText: {
    marginTop: "16px",
    color: MUTED,
    fontSize: "15px",
    lineHeight: 1.9,
  },

  showcaseChecklist: {
    display: "grid",
    gap: "12px",
    marginTop: "24px",
  },

  checkItem: {
    backgroundColor: ORANGE_SOFT,
    color: NAVY_LIGHT,
    border: "1px solid #fed7aa",
    borderRadius: "14px",
    padding: "12px 14px",
    fontWeight: "700",
    fontSize: "14px",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gridTemplateRows: "repeat(2, 1fr)",
    gap: "18px",
    minHeight: "500px",
  },

  imageCardTall: {
    position: "relative",
    gridRow: "1 / span 2",
    borderRadius: "26px",
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
  },

  imageCardSmall: {
    position: "relative",
    borderRadius: "26px",
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
  },

  gridImageTall: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  gridImageSmall: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageOverlayLabel: {
    position: "absolute",
    left: "16px",
    bottom: "16px",
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "13px",
    backdropFilter: "blur(6px)",
  },

  viewAllButton: {
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: NAVY,
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
  },

  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  reportCard: {
    backgroundColor: CARD_BG,
    borderRadius: "24px",
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.05)",
  },

  reportImageWrap: {
    position: "relative",
    width: "100%",
    height: "240px",
    backgroundColor: "#f1f5f9",
  },

  reportImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  reportImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: MUTED,
    fontWeight: "700",
    fontSize: "15px",
    backgroundColor: "#f8fafc",
  },

  reportImageOverlay: {
    position: "absolute",
    top: "14px",
    left: "14px",
    right: "14px",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },

  reportBody: {
    padding: "22px",
  },

  reportCategory: {
    backgroundColor: ORANGE_SOFT,
    color: ORANGE,
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    border: "1px solid #fed7aa",
  },

  reportStatus: {
    backgroundColor: "#ffffff",
    color: NAVY,
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    border: "1px solid #e2e8f0",
  },

  reportTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    color: NAVY,
  },

  reportMeta: {
    margin: "10px 0 0 0",
    color: MUTED,
    lineHeight: 1.7,
    fontSize: "14px",
  },

  reportActionButton: {
    marginTop: "18px",
    border: "none",
    backgroundColor: NAVY,
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  stepCard: {
    backgroundColor: CARD_BG,
    borderRadius: "24px",
    padding: "26px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.05)",
  },

  stepNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "16px",
    boxShadow: "0 10px 18px rgba(249, 115, 22, 0.22)",
  },

  stepTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
    color: NAVY,
  },

  stepText: {
    marginTop: "10px",
    color: MUTED,
    lineHeight: 1.8,
    fontSize: "14px",
  },

  faqShell: {
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gap: "24px",
    alignItems: "start",
  },

  faqLeft: {
    backgroundColor: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: "28px",
    padding: "30px",
    boxShadow: "0 14px 35px rgba(15, 23, 42, 0.05)",
  },

  faqGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px",
  },

  faqCard: {
    backgroundColor: CARD_BG,
    borderRadius: "22px",
    padding: "24px",
    border: `1px solid ${BORDER}`,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  faqQuestion: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: NAVY,
  },

  faqAnswer: {
    marginTop: "10px",
    color: MUTED,
    lineHeight: 1.75,
    fontSize: "14px",
  },

  ctaSection: {
    marginTop: "52px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderRadius: "30px",
    padding: "54px 30px",
    textAlign: "center",
    boxShadow: "0 22px 50px rgba(15, 23, 42, 0.14)",
  },

  ctaContent: {
    maxWidth: "820px",
    margin: "0 auto",
  },

  ctaMini: {
    margin: 0,
    color: "#fdba74",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "12px",
  },

  ctaTitle: {
    margin: "14px 0 0 0",
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    color: "#ffffff",
  },

  ctaText: {
    margin: "16px auto 0",
    maxWidth: "700px",
    lineHeight: 1.9,
    color: "#cbd5e1",
    fontSize: "16px",
  },

  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  ctaPrimaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#ffffff",
    padding: "15px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow: "0 12px 22px rgba(249, 115, 22, 0.28)",
  },

  ctaOutlineButton: {
    border: "1px solid rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: "#ffffff",
    padding: "15px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    backdropFilter: "blur(8px)",
  },
};

export default HomeBrowsePage;