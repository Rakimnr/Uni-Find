import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Navbar({ active = "home" }) {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="UniFind Logo" style={styles.logoImage} />
          <div>
            <h1 style={styles.logoText}>UniFind</h1>
            <p style={styles.logoSub}>UNIVERSITY LOST & FOUND PORTAL</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <button
            type="button"
            style={active === "home" ? styles.activeNavButton : styles.navButton}
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            type="button"
            style={active === "found" ? styles.activeNavButton : styles.navButton}
            onClick={() => navigate("/found-items")}
          >
            Found Portal
          </button>

          <button
            type="button"
            style={active === "lost" ? styles.activeNavButton : styles.navButton}
            onClick={() => navigate("/lost-items")}
          >
            Lost Portal
          </button>

          <button
            type="button"
            style={active === "about" ? styles.activeNavButton : styles.navButton}
            onClick={() => navigate("/about")}
          >
            About Us
          </button>
        </nav>

        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/report-lost")}
          >
            + Report Lost
          </button>
        </div>
      </div>
    </header>
  );
}

const ORANGE = "#f97316";
const BORDER = "#e5e7eb";
const TEXT = "#111827";
const MUTED = "#6b7280";

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${BORDER}`,
  },

  headerInner: {
    maxWidth: "1380px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    minWidth: "240px",
  },

  logoImage: {
    width: "56px",
    height: "56px",
    objectFit: "contain",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    padding: "4px",
    border: `1px solid ${BORDER}`,
  },

  logoText: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    color: TEXT,
  },

  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "600",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: "999px",
    padding: "6px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  navButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s ease",
  },

  activeNavButton: {
    border: "none",
    backgroundColor: ORANGE,
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 8px 18px rgba(249, 115, 22, 0.22)",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  secondaryButton: {
    border: `1px solid ${BORDER}`,
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  primaryButton: {
    border: "none",
    backgroundColor: ORANGE,
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 8px 18px rgba(249, 115, 22, 0.22)",
  },
};

export default Navbar;