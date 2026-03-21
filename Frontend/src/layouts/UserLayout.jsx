import { Outlet, useLocation, useNavigate } from "react-router-dom";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/dashboard";

  const isItemsPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/report-found-item") ||
    location.pathname.startsWith("/claims/new") ||
    location.pathname.startsWith("/found");

  const isClaimsPage = location.pathname.startsWith("/my-claims");

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoBox}>
            <div style={styles.logoCircle}>U</div>
            <div>
              <h2 style={styles.logoText}>UniFind</h2>
              <p style={styles.logoSub}>University Portal</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <div
              onClick={() => navigate("/dashboard")}
              style={{
                ...styles.navItem,
                ...(isDashboard ? styles.activeNavItem : {}),
              }}
            >
              Dashboard
            </div>

            <div
              onClick={() => navigate("/")}
              style={{
                ...styles.navItem,
                ...(isItemsPage ? styles.activeNavItem : {}),
              }}
            >
              Items
            </div>

            <div
              onClick={() => navigate("/my-claims")}
              style={{
                ...styles.navItem,
                ...(isClaimsPage ? styles.activeNavItem : {}),
              }}
            >
              Claims
            </div>
          </nav>
        </div>

        <button
          style={styles.reportButton}
          onClick={() => navigate("/report-found-item")}
        >
          + Report Found Item
        </button>
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
    width: "100%",
    backgroundColor: "#f6f7fb",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  sidebar: {
    width: "260px",
    minWidth: "260px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "34px",
  },
  logoCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    backgroundColor: "#f97316",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "22px",
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
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
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "15px",
  },
  activeNavItem: {
    backgroundColor: "#fff7ed",
    color: "#f97316",
  },
  reportButton: {
    backgroundColor: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    fontSize: "15px",
  },
  main: {
    flex: 1,
    width: "100%",
    padding: "26px 32px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
};

export default UserLayout;