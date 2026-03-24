import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLostItemById } from "../../api/lostApi.js";

function LostItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await getLostItemById(id);
        setItem(result.data);
      } catch {
        setError("Failed to load lost item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  if (loading) return <div style={styles.loader}>Loading...</div>;
  if (error) return <div style={styles.loader}>{error}</div>;
  if (!item) return <div style={styles.loader}>Item not found</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainWrapper}>
        
        {/* Navigation Breadcrumb */}
        <nav style={styles.navBar}>
          <Link to="/lost-reports" style={styles.backBtn}>
            <span style={{ fontSize: '18px' }}>←</span> Back to Gallery
          </Link>
          <Link to="/" style={styles.homeBtn}>Dashboard</Link>
        </nav>

        <div style={styles.layoutGrid}>
          
          {/* LEFT: The Image Showcase */}
          <div style={styles.visualSection}>
            <div style={styles.imageFrame}>
              {item.image ? (
                <>
                  {/* Blurred background auto-adapts to image color */}
                  <div style={{
                    ...styles.blurredBg,
                    backgroundImage: `url(http://localhost:5001${item.image})`
                  }} />
                  <img
                    src={`http://localhost:5001${item.image}`}
                    alt={item.title}
                    style={styles.mainImg}
                  />
                </>
              ) : (
                <div style={styles.placeholderImg}>No Image Available</div>
              )}
            </div>
            
            <div style={styles.descCard}>
              <h3 style={styles.sectionHeading}>Description</h3>
              <p style={styles.bodyText}>{item.description || "No description provided."}</p>
              
              {item.uniqueFeatures && (
                <div style={styles.featureBox}>
                  <span style={styles.featureLabel}>Distinctive Marks:</span>
                  <p style={styles.featureText}>{item.uniqueFeatures}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Information & Contact */}
          <div style={styles.infoSection}>
            
            {/* Vital Stats Card */}
            <div style={styles.statsCard}>
              <div style={styles.statusRow}>
                <span style={styles.catLabel}>{item.category}</span>
                {/* STATUS PILL: Pale Orange background with primary orange accent */}
                <div style={{...styles.statusPill, backgroundColor: item.status === 'open' ? '#ffedd5' : '#fef3c7'}}>
                   <span style={{...styles.dot, backgroundColor: item.status === 'open' ? '#f97316' : '#f59e0b'}} />
                   {item.status?.replace('_', ' ')}
                </div>
              </div>
              
              <h1 style={styles.itemTitle}>{item.title}</h1>
              
              <div style={styles.metaGrid}>
                <div style={styles.metaCell}>
                  <p style={styles.metaTitle}>📍 Last Seen</p>
                  <p style={styles.metaValue}>{item.lostLocation}</p>
                </div>
                <div style={styles.metaCell}>
                  <p style={styles.metaTitle}>📅 Reported On</p>
                  <p style={styles.metaValue}>{formatDate(item.dateLost)}</p>
                </div>
              </div>
            </div>

            {/* Owner Profile Card */}
            <div style={styles.contactCard}>
              <h3 style={styles.contactTitle}>Contact Owner</h3>
              <div style={styles.ownerInfo}>
                {/* AVATAR: Primary Orange */}
                <div style={styles.ownerAvatar}>
                  {item.contactName?.charAt(0)}
                </div>
                <div>
                  <p style={styles.ownerName}>{item.contactName}</p>
                  <p style={styles.ownerEmail}>{item.contactEmail}</p>
                </div>
              </div>
              
              <div style={styles.contactDetails}>
                <div style={styles.detailRow}>
                  <span>Email Reference</span>
                  <span style={styles.detailVal}>Verified</span>
                </div>
                {item.contactPhone && (
                  <div style={styles.detailRow}>
                    <span>Phone</span>
                    <span style={styles.detailVal}>{item.contactPhone}</span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON: Primary Orange */}
              <button 
                style={styles.msgBtn}
                onClick={() => window.location.href = `mailto:${item.contactEmail}`}
              >
                Reach Out via Email
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#fcfcfd", // Clean, near-white base
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "20px",
  },
  mainWrapper: {
    maxWidth: "1140px",
    margin: "0 auto",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "0 10px",
  },
  backBtn: {
    textDecoration: "none",
    color: "#f97316", // Primary Orange
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  homeBtn: {
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#1e293b",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
  },
  layoutGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "32px",
    alignItems: "start",
  },

  /* Visual Section */
  visualSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  imageFrame: {
    position: "relative",
    height: "420px",
    backgroundColor: "#f1f5f9", // Neutral gray placeholder
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  blurredBg: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(40px) opacity(0.3)", // Auto-adapts to image colors
    transform: "scale(1.1)",
  },
  mainImg: {
    position: "relative",
    maxHeight: "90%",
    maxWidth: "90%",
    objectFit: "contain",
    borderRadius: "12px",
    zIndex: 1,
  },
  placeholderImg: {
    color: "#94a3b8",
    fontSize: "16px",
    fontWeight: "600",
  },
  descCard: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #f1f5f9",
  },
  sectionHeading: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a", // Slate heading
    margin: "0 0 16px 0",
  },
  bodyText: {
    fontSize: "16px",
    color: "#475569", // Slate body text
    lineHeight: "1.8",
    margin: 0,
  },
  featureBox: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#fff7ed", // Pale Orange background
    borderRadius: "12px",
    borderLeft: "4px solid #f97316", // Primary Orange border
  },
  featureLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#f97316", // Primary Orange
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  },
  featureText: {
    margin: 0,
    color: "#1e293b",
    fontWeight: "500",
  },

  /* Info Section */
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  catLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#7c2d12", // Burnt Orange text for contrast
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  statusPill: {
    padding: "6px 12px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textTransform: "capitalize",
    color: "#1e293b",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  itemTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a", // Slate heading
    margin: "0 0 24px 0",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  metaCell: {
    padding: "16px",
    backgroundColor: "#fcfcfd",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
  },
  metaTitle: {
    margin: "0 0 4px 0",
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8", // Grey label
  },
  metaValue: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b", // Slate value
  },

  /* Contact Card */
  contactCard: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #f1f5f9",
  },
  contactTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  ownerAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f97316", // Primary Orange
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px",
  },
  ownerName: {
    margin: 0,
    fontWeight: "700",
    color: "#1e293b",
  },
  ownerEmail: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
  contactDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#64748b",
  },
  detailVal: {
    fontWeight: "600",
    color: "#1e293b",
  },
  msgBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#f97316", // Primary Orange
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.1s",
    boxShadow: "0 4px 10px rgba(249, 115, 22, 0.2)",
  },
  loader: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "18px",
  }
};

export default LostItemDetailsPage;