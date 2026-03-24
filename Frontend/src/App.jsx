import { Routes, Route, Link, Navigate } from "react-router-dom";
import ReportLostItemPage from "./pages/user/ReportLostItemPage.jsx";
import MyLostReportsPage from "./pages/user/MyLostReportsPage.jsx";

function HomePage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>UniFind - Lost Item Module</h1>
        <p style={styles.text}>
          This is Rakindu&apos;s Lost Item Reporting module.
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/report-lost" style={styles.primaryButton}>
            Report Lost Item
          </Link>

          <Link to="/lost-reports" style={styles.secondaryButton}>
            View Lost Reports
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },
  title: {
    margin: "0 0 12px 0",
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },
  text: {
    margin: "0 0 24px 0",
    fontSize: "16px",
    color: "#6b7280",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    textDecoration: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  secondaryButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
  },
};

export default App;