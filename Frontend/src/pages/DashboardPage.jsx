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

  const getRoleBadge = (role) => {
    const value = role?.toLowerCase();

    if (value === "admin") {
      return { label: "Admin", bg: "#ede9fe", color: "#6d28d9", icon: "🛡️" };
    }

    if (value === "student") {
      return { label: "Student", bg: "#eff6ff", color: "#1d4ed8", icon: "🎓" };
    }

    if (value === "staff") {
      return { label: "Staff", bg: "#ecfdf5", color: "#15803d", icon: "🏫" };
    }

    return {
      label: role || "Member",
      bg: "#f1f5f9",
      color: "#334155",
      icon: "👤",
    };
  };

  const badge = getRoleBadge(user?.role);

  const stats = [
    {
      label: "Items Reported",
      value: 0,
      icon: "🔎",
      bg: "#fffbeb",
      iconColor: "#d97706",
    },
    {
      label: "Claims Completed",
      value: 0,
      icon: "✅",
      bg: "#ecfdf5",
      iconColor: "#15803d",
    },
    {
      label: "Active Listings",
      value: 0,
      icon: "📋",
      bg: "#eff6ff",
      iconColor: "#2563eb",
    },
  ];

  const quickActions = [
    {
      title: "Report a lost item",
      text: "Start a new report when you lose something on campus.",
      icon: "📝",
      bg: "#fffbeb",
    },
    {
      title: "Browse found items",
      text: "Search the latest found items and claim what belongs to you.",
      icon: "🧭",
      bg: "#eff6ff",
    },
    {
      title: "Track your requests",
      text: "Monitor current submissions and future claim updates.",
      icon: "📦",
      bg: "#ecfeff",
    },
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
                This is your UniFind control center. Manage your account, check your
                activity, and continue reporting or claiming items with a cleaner,
                faster workflow.
              </p>

              <div
                className="uf-db-role-badge"
                style={{ background: badge.bg, color: badge.color }}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="uf-db-grid">
          <div className="uf-db-left">
            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Overview</h3>
                  <p>A quick look at your current portal activity.</p>
                </div>
                <span className="uf-db-chip">Live session</span>
              </div>

              <div className="uf-db-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="uf-db-stat">
                    <div className="uf-db-stat-top">
                      <div
                        className="uf-db-stat-icon"
                        style={{ background: stat.bg, color: stat.iconColor }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <p className="uf-db-stat-value">{stat.value}</p>
                    <p className="uf-db-stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Quick Actions</h3>
                  <p>Useful things you will do most often in the portal.</p>
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

              <div className="uf-db-quick-actions">
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
                  <p>Your current member information.</p>
                </div>
              </div>

              <div className="uf-db-info-list">
                <div className="uf-db-info-row">
                  <div className="uf-db-info-icon">👤</div>
                  <div className="uf-db-info-copy">
                    <label>Full Name</label>
                    <span>{user?.fullName || "—"}</span>
                  </div>
                </div>

                <div className="uf-db-info-row">
                  <div className="uf-db-info-icon">✉️</div>
                  <div className="uf-db-info-copy">
                    <label>Email Address</label>
                    <span>{user?.email || "—"}</span>
                  </div>
                </div>

                <div className="uf-db-info-row">
                  <div className="uf-db-info-icon">🪪</div>
                  <div className="uf-db-info-copy">
                    <label>Role</label>
                    <span>{badge.label}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="uf-db-card">
              <div className="uf-db-card-header">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Your latest updates will appear here.</p>
                </div>
              </div>

              <div className="uf-db-empty">
                <div className="uf-db-empty-icon">📭</div>
                <strong>No activity yet</strong>
                <p>
                  Once you report a lost item or submit a claim, your recent activity
                  will appear in this space.
                </p>
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