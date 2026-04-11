import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Navbar({ active = "home" }) {
  const navigate = useNavigate();

  const navItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "found", label: "Found Portal", path: "/found-items" },
    { key: "lost", label: "Lost Portal", path: "/lost-items" },
    { key: "about", label: "About Us", path: "/about" },
  ];

  return (
    <header style={styles.header}>
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
const TEXT = "#111827";
const MUTED = "#6b7280";

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "18px 24px 0",
    background:
      "linear-gradient(180deg, rgba(248,243,236,0.95) 0%, rgba(248,243,236,0.82) 60%, rgba(248,243,236,0) 100%)",
    backdropFilter: "blur(12px)",
  },

  headerInner: {
    maxWidth: "1380px",
    margin: "0 auto",
    minHeight: "84px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    padding: "14px 18px",
    borderRadius: "28px",
    background: "rgba(255, 252, 247, 0.88)",
    border: "1px solid rgba(234, 88, 12, 0.10)",
    boxShadow: "0 18px 40px rgba(17, 24, 39, 0.08)",
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
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #fffaf5 0%, #ffffff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(234, 88, 12, 0.10)",
    boxShadow: "0 12px 24px rgba(249, 115, 22, 0.12)",
    overflow: "hidden",
  },

  logoImage: {
    width: "42px",
    height: "42px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  logoText: {
    margin: 0,
    color: TEXT,
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  logoSub: {
    margin: "4px 0 0 0",
    color: MUTED,
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "6px",
    borderRadius: "999px",
    background: "#fffdf9",
    border: "1px solid #eee5db",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
    flexWrap: "wrap",
  },

  navButton: {
    border: "none",
    background: "transparent",
    color: "#4b5563",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "0.2s ease",
  },

  activeNavButton: {
    border: "none",
    background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DARK} 100%)`,
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 10px 24px rgba(249, 115, 22, 0.28)",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  loginButton: {
    border: "1px solid #eadfd4",
    background: "#fffdfa",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 8px 18px rgba(17, 24, 39, 0.04)",
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