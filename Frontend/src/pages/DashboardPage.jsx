import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const quickActions = [
    {
      title: "Report a lost item",
      text: "Start a new report when you lose something on campus.",
      icon: "📝",
      bg: "#fffbeb",
    },
    {
      title: "Browse found items",
      text: "Search current found items and claim what belongs to you.",
      icon: "🧭",
      bg: "#eff6ff",
    },
    {
      title: "Track your requests",
      text: "Monitor your activity and future claim updates.",
      icon: "📦",
      bg: "#ecfeff",
    },
  ];

  const details = [
    { label: "Full Name", value: user?.fullName || "—", icon: "👤" },
    { label: "Email", value: user?.email || "—", icon: "✉️" },
    { label: "Phone", value: user?.phone || "—", icon: "📞" },
    { label: "Student ID", value: user?.studentId || "—", icon: "🪪" },
    { label: "Faculty", value: user?.faculty || "—", icon: "🏫" },
    { label: "Department", value: user?.department || "—", icon: "🏷️" },
    { label: "Batch", value: user?.batch || "—", icon: "📘" },
    { label: "Role", value: user?.role || "member", icon: "🔐" },
  ];

  return (
    <div className="uf-db-root">
      <nav className="uf-db-nav">
        <div className="uf-db-brand">
          <div className="uf-db-brand-badge">🔍</div>
          <div>
            <strong>
              Uni<span>Find</span>
            </strong>
            <small>Member Dashboard</small>
          </div>
        </div>

        <div className="uf-db-nav-right">
          <div className="uf-db-nav-meta">
            <strong>{user?.fullName || "Member"}</strong>
            <span>{user?.email || "No email available"}</span>
          </div>
          <div className="uf-db-avatar">{getInitials(user?.fullName)}</div>
        </div>
      </nav>

      <main className="uf-db-shell">
        <section className="uf-db-hero">
          <div className="uf-db-hero-grid" />
          <div className="uf-db-hero-inner">
            <div className="uf-db-hero-avatar">{getInitials(user?.fullName)}</div>
            <div className="uf-db-hero-copy">
              <h1>
                Welcome back, {user?.fullName?.split(" ")[0] || "Member"} 👋
              </h1>
              <p>
                Your account is ready. You can now manage lost item reporting,
                search found items, and view your member profile details here.
              </p>
            </div>
          </div>
        </section>

        <section className="uf-db-grid">
          <div className="uf-db-left">
            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Quick Actions</h3>
                  <p>Common things you may want to do next.</p>
                </div>
                <span className="uf-db-chip">Start here</span>
              </div>

              <div className="uf-db-actions">
                {quickActions.map((item) => (
                  <div key={item.title} className="uf-db-action">
                    <div
                      className="uf-db-action-icon"
                      style={{ background: item.bg }}
                    >
                      {item.icon}
                    </div>
                    <div className="uf-db-action-copy">
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: 14 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <button className="uf-db-btn primary" type="button">
                  Report Item
                </button>
                <button className="uf-db-btn secondary" type="button">
                  Browse Items
                </button>
              </div>
            </div>
          </div>

          <div className="uf-db-right">
            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Account Details</h3>
                  <p>Your member profile information.</p>
                </div>
              </div>

              <div className="uf-db-account-grid">
                {details.map((item) => (
                  <div key={item.label} className="uf-db-info-row">
                    <div className="uf-db-info-icon">{item.icon}</div>
                    <div className="uf-db-info-copy">
                      <label>{item.label}</label>
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Session</h3>
                  <p>Manage your current sign-in session.</p>
                </div>
              </div>

              <button className="uf-db-btn danger" type="button" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;