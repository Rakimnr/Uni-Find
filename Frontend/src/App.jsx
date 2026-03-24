import { Routes, Route, Link, Navigate } from "react-router-dom";
import ReportLostItemPage from "./pages/user/ReportLostItemPage.jsx";
import MyLostReportsPage from "./pages/user/MyLostReportsPage.jsx";
import LostItemDetailsPage from "./pages/user/LostItemDetailsPage.jsx";
import EditLostItemPage from "./pages/user/EditLostItemPage.jsx";
import AdminManageLostPage from "./pages/admin/AdminManageLostPage.jsx";

function HomePage() {
  return (
    <div style={styles.page}>
      <div style={styles.heroCard}>
        <h1 style={styles.title}>UniFind - Lost Item Portal</h1>
        <p style={styles.text}>
          Report lost items, track reports, and manage your lost item requests.
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/report-lost" style={styles.primaryButton}>
            Report Lost Item
          </Link>

          <Link to="/lost-reports" style={styles.secondaryButton}>
            View Lost Reports
          </Link>

          <Link to="/admin/lost-items" style={styles.adminButton}>
            Admin Manage Lost Items
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/report-lost" element={<ReportLostItemPage />} />
      <Route path="/lost-reports" element={<MyLostReportsPage />} />
      <Route path="/lost-reports/:id" element={<LostItemDetailsPage />} />
      <Route path="/lost-reports/edit/:id" element={<EditLostItemPage />} />
      <Route path="/admin/lost-items" element={<AdminManageLostPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #f9fafb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "40px",
    maxWidth: "760px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    border: "1px solid #f3f4f6",
  },
  title: {
    margin: "0 0 14px 0",
    fontSize: "38px",
    fontWeight: "800",
    color: "#111827",
  },
  text: {
    margin: "0 0 28px 0",
    fontSize: "17px",
    color: "#6b7280",
    lineHeight: "1.6",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  primaryButton: {
    textDecoration: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  secondaryButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "13px 20px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  adminButton: {
    textDecoration: "none",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: "13px 20px",
    borderRadius: "12px",
    fontWeight: "700",
  },
};

export default App;