import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/admin";
  const isClaimReview = location.pathname.startsWith("/admin/claims");
  const isClaimReport = location.pathname.startsWith("/admin/claim-report");
  const isManageFound = location.pathname.startsWith("/admin/found-items");
  const isManageLost = location.pathname.startsWith("/admin/lost-items");
  const isAddFound = location.pathname.startsWith("/admin/add-found-item");
  const isExpired = location.pathname.startsWith("/admin/expired-items");

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          {/* ✅ CLICKABLE LOGO */}
          <div
            style={styles.logoBox}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="logo" style={styles.logoImage} />

            <div>
              <h2 style={styles.logoText}>UniFind Admin</h2>
              <p style={styles.logoSub}>Admin Panel</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav style={styles.nav}>
            <div
              style={{
                ...styles.navItem,
                ...(isDashboard ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isClaimReview ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/claims")}
            >
              Claim Review
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isClaimReport ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/claim-report")}
            >
              Claim Report
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isManageFound ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/found-items")}
            >
              Manage Found Items
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isManageLost ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/lost-items")}
            >
              Manage Lost Items
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isAddFound ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/add-found-item")}
            >
              Add Found Item
            </div>

            <div
              style={{
                ...styles.navItem,
                ...(isExpired ? styles.activeNavItem : {}),
              }}
              onClick={() => navigate("/admin/expired-items")}
            >
              Expired Items
            </div>
          </nav>
        </div>

        {/* ✅ BOTTOM ACTIONS */}
        <div style={styles.bottomActions}>
          <button
            style={styles.outlineBtn}
            onClick={() => navigate("/")}
          >
            ← Back to Site
          </button>

          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/login")}
          >
            Log Out
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
    color: "#374151",
    fontWeight: "600",
  },

  activeNavItem: {
    backgroundColor: "#fff7ed",
    color: "#f97316",
    fontWeight: "700",
  },

  /* 🔥 NEW */
  bottomActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  primaryBtn: {
    backgroundColor: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  outlineBtn: {
    backgroundColor: "transparent",
    color: "#f97316",
    border: "1.5px solid #f97316",
    borderRadius: "14px",
    padding: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "26px",
  },
};

export default AdminLayout;