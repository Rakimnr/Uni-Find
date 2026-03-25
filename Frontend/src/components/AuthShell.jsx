import { Link } from "react-router-dom";

function AuthShell({
  mode = "login",
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  const panelContent =
    mode === "register"
      ? {
          heading: (
            <>
              Join <span>UniFind</span>
            </>
          ),
          text:
            "Create your account and start reporting, searching, and claiming lost items across campus with a secure and smooth experience.",
          pills: ["Secure Access", "Fast Reporting", "Claim Tracking"],
          steps: [
            {
              number: "1",
              title: "Create your profile",
              desc: "Register with your name and email to unlock the member portal.",
            },
            {
              number: "2",
              title: "Report or search items",
              desc: "List lost items or browse found belongings in seconds.",
            },
            {
              number: "3",
              title: "Recover faster",
              desc: "Track your requests and manage claims from one dashboard.",
            },
          ],
        }
      : {
          heading: (
            <>
              Welcome to <span>UniFind</span>
            </>
          ),
          text:
            "Sign in to manage your lost and found activity, view your account, and continue where you left off.",
          pills: ["Campus Ready", "Protected Session", "Easy Navigation"],
          steps: [
            {
              number: "1",
              title: "Access your account",
              desc: "Use your registered email and password to sign in securely.",
            },
            {
              number: "2",
              title: "Manage your activity",
              desc: "View your profile, track claims, and stay organized.",
            },
            {
              number: "3",
              title: "Stay connected",
              desc: "Continue reporting and recovering items with less hassle.",
            },
          ],
        };

  return (
    <div className="uf-auth-root">
      <section className="uf-auth-hero">
        <div className="uf-auth-hero-overlay" />
        <div className="uf-auth-grid" />

        <div className="uf-auth-floaters" aria-hidden="true">
          <span>🎒</span>
          <span>🔑</span>
          <span>📱</span>
          <span>🎧</span>
          <span>💳</span>
          <span>👓</span>
        </div>

        <div className="uf-auth-brand">
          <div className="uf-auth-logo">
            <div className="uf-auth-logo-badge">🔍</div>
            <div>
              <p className="uf-auth-mini">Lost &amp; Found Portal</p>
              <h1>{panelContent.heading}</h1>
            </div>
          </div>

          <p className="uf-auth-brand-text">{panelContent.text}</p>

          <div className="uf-auth-pills">
            {panelContent.pills.map((pill) => (
              <span key={pill} className="uf-auth-pill">
                {pill}
              </span>
            ))}
          </div>

          <div className="uf-auth-steps">
            {panelContent.steps.map((step) => (
              <div key={step.number} className="uf-auth-step">
                <div className="uf-auth-step-num">{step.number}</div>
                <div className="uf-auth-step-copy">
                  <strong>{step.title}</strong>
                  <span>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="uf-auth-form-side">
        <div className="uf-auth-form-card">
          <div className="uf-auth-topline">
            <Link to="/" className="uf-auth-mobile-logo">
              <span>🔍</span>
              <strong>UniFind</strong>
            </Link>
          </div>

          <div className="uf-auth-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {children}

          <div className="uf-auth-footer">
            <p>
              {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthShell;