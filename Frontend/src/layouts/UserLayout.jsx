import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";
  const isFound = location.pathname.startsWith("/found-items");
  const isLost = location.pathname.startsWith("/lost-items");
  const isClaims = location.pathname.startsWith("/my-claims");

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          {/* LOGO */}
          <div style={styles.logoBox} onClick={() => navigate("/")}>
            <div style={styles.logoWrap}>
              <img src={logo} alt="logo" style={styles.logoImage} />
            </div>

            <div>
              <h2 style={styles.logoText}>UniFind</h2>
              <p style={styles.logoSub}>University Portal</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav style={styles.nav}>
            <div
              style={{
                ...styles.navItem,
                ...(isDashboard ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isFound ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/found-items")}
            >
              Found Items
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isLost ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/lost-items")}
            >
              Lost Items
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isClaims ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/my-claims")}
            >
              My Claims
            </div>
          </nav>
        </div>

        {/* 🔥 CLEAN BUTTONS (NO BOX) */}
        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/report-found-item")}
          >
            + Report Found Item
          </button>

          <button
            style={styles.outlineBtn}
            onClick={() => navigate("/report-lost")}
          >
            + Report Lost Item
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #fff7ed 0%, #f8fafc 220px, #f8fafc 100%)",
  },

  sidebar: {
    width: "260px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "30px",
    cursor: "pointer",
  },

  logoWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
    border: "1px solid rgba(249,115,22,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
    borderRadius: "8px",
  },

  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
  },

  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "11px",
    color: "#6b7280",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: "700",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  navItem: {
    padding: "13px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
  },

  activeNavItem: {
    backgroundColor: "#fff7ed",
    color: "#f97316",
    fontWeight: "700",
  },

  /* 🔥 CLEAN BUTTONS */
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  primaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 8px 18px rgba(249,115,22,0.25)",
  },

  outlineBtn: {
    width: "100%",
    background: "transparent",
    color: "#f97316",
    border: "1.5px solid #f97316",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  main: {
    flex: 1,
    padding: "26px",
  },
};

export default UserLayout;