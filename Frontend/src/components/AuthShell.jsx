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
  const content =
    mode === "register"
      ? {
          heading: (
            <>
              Create your <span>UniFind</span> account
            </>
          ),
          text:
            "Register once and manage lost item reports, found item searches, and account activity from one secure place.",
          points: [
            "Simple sign up",
            "Secure member access",
            "Easy lost & found workflow",
          ],
        }
      : {
          heading: (
            <>
              Welcome back to <span>UniFind</span>
            </>
          ),
          text:
            "Sign in quickly and continue managing your lost and found activity with a cleaner and easier experience.",
          points: [
            "Fast sign in",
            "Protected session",
            "Simple dashboard access",
          ],
        };

  return (
    <div className="uf-auth-page">
      <div className="uf-auth-layout">
        <section className="uf-auth-left">
          <div className="uf-auth-left-overlay" />
          <div className="uf-auth-left-grid" />

          <div className="uf-auth-left-content">
            <div className="uf-auth-brand-row">
              <div className="uf-auth-logo-box">🔍</div>
              <div>
                <p className="uf-auth-mini">Lost &amp; Found Portal</p>
                <h1>{content.heading}</h1>
              </div>
            </div>

            <p className="uf-auth-lead">{content.text}</p>

            <div className="uf-auth-tags">
              {content.points.map((item) => (
                <span key={item} className="uf-auth-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="uf-auth-right">
          <div className="uf-auth-card">
            <div className="uf-auth-card-top">
              <Link to="/" className="uf-auth-home-link">
                <span>🔍</span>
                <strong>UniFind</strong>
              </Link>
            </div>

            <div className="uf-auth-head">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            {children}

            <div className="uf-auth-bottom">
              <p>
                {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthShell;