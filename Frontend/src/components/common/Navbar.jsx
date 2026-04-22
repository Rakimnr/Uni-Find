import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Navbar({ active = "home", isOverlay = false }) {
  const navigate = useNavigate();

  const navItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "found", label: "Found Portal", path: "/found-items" },
    { key: "lost", label: "Lost Portal", path: "/lost-items" },
    { key: "about", label: "About Us", path: "/about" },
  ];

  return (
    <header
      style={{
        ...styles.header,
        ...(isOverlay ? styles.headerOverlay : styles.headerDefault),
      }}
    >
      <div style={styles.headerInner}>
        <div style={styles.logoBox} onClick={() => navigate("/")}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="UniFind Logo" style={styles.logoImage} />
          </div>

          <div>
            <h1 style={styles.logoText}>UniFind</h1>
            <p style={styles.logoSub}>University Lost & Found Portal</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = active === item.key;

            return (
              <button
                key={item.key}
                type="button"
                style={isActive ? styles.activeNavButton : styles.navButton}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            type="button"
            style={styles.reportButton}
            onClick={() => navigate("/report-lost")}
          >
            Report Lost
          </button>
        </div>
      </div>
    </header>
  );
}

const ORANGE = "#f97316";
const ORANGE_DARK = "#ea580c";
const NAVY_START = "#0f172a";
const NAVY_END = "#1e293b";

const styles = {
  header: {
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    padding: "18px 24px 0",
    boxSizing: "border-box",
  },

  headerOverlay: {
    position: "absolute",
  },

  headerDefault: {
    position: "relative",
  },

  headerInner: {
    maxWidth: "1380px",
    margin: "0 auto",
    minHeight: "82px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "14px 18px",
    borderRadius: "24px",
    background: `linear-gradient(135deg, ${NAVY_START} 0%, ${NAVY_END} 100%)`,
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.24)",
    flexWrap: "wrap",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    flexShrink: 0,
  },

  logoWrap: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.14)",
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
  },

  logoImage: {
    width: "42px",
    height: "42px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  logoText: {
    margin: 0,
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  logoSub: {
    margin: "4px 0 0 0",
    color: "rgba(255,255,255,0.72)",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "26px",
    padding: "6px 10px",
    flexWrap: "wrap",
  },

  navButton: {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.82)",
    padding: "10px 2px 12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    borderBottom: "3px solid transparent",
    transition: "0.2s ease",
  },

  activeNavButton: {
    border: "none",
    background: "transparent",
    color: "#ffffff",
    padding: "10px 2px 12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "800",
    borderBottom: `3px solid ${ORANGE}`,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  loginButton: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },

  reportButton: {
    border: "none",
    background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`,
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 12px 24px rgba(249, 115, 22, 0.28)",
  },
};

export default Navbar;