import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg"; // ✅ add this

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
          {/* ✅ FIXED LOGO */}
          <div style={styles.logoBox} onClick={() => navigate("/")}>
            <img src={logo} alt="logo" style={styles.logoImage} />

            <div>
              <h2 style={styles.logoText}>UniFind</h2>
              <p style={styles.logoSub}>University Portal</p>
            </div>
          </div>

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

        <div>
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
    backgroundColor: "#f6f7fb",
  },

  sidebar: {
    width: "270px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "34px",
    cursor: "pointer",
  },

  logoImage: {
    width: "46px",
    height: "46px",
    objectFit: "contain",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    padding: "4px",
    border: "1px solid #e5e7eb",
  },

  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },

  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  navItem: {
    padding: "14px 16px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  activeNavItem: {
    backgroundColor: "#fff7ed",
    color: "#f97316",
    fontWeight: "700",
  },

  primaryBtn: {
    backgroundColor: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
    cursor: "pointer",
  },

  outlineBtn: {
    backgroundColor: "#fff",
    color: "#f97316",
    border: "1px solid #f97316",
    borderRadius: "14px",
    padding: "14px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "26px",
  },
};

export default UserLayout;