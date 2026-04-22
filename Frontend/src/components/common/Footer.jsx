import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        <div style={styles.brandSection}>
          <div style={styles.brandRow}>
            <img src={logo} alt="UniFind Logo" style={styles.logo} />
            <div>
              <h2 style={styles.brandTitle}>UniFind</h2>
              <p style={styles.brandText}>
                A smarter and more beautiful lost and found experience for
                students and staff at SLIIT.
              </p>
            </div>
          </div>

          <p style={styles.brandDescription}>
            UniFind helps students report missing belongings, browse found
            items, and recover them through a clean and organized digital
            platform made for campus life.
          </p>

          <div style={styles.socialRow}>
            <a
              href="https://web.facebook.com/sliit.lk/?_rdc=1&_rdr#"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/sliit.life/"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
            >
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/school/sliit/"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
            >
              LinkedIn
            </a>

            <a
              href="https://www.youtube.com/user/SLIITtube"
              target="_blank"
              rel="noreferrer"
              style={styles.socialButton}
            >
              YouTube
            </a>
          </div>
        </div>

        <div style={styles.linksWrapper}>
          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>Quick Links</h3>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/report-lost")}
            >
              Report Lost Item
            </button>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/lost-items")}
            >
              Lost Items
            </button>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/found-items")}
            >
              Found Items
            </button>
          </div>

          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>Company</h3>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/about")}
            >
              About Us
            </button>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              type="button"
              style={styles.linkButton}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

          <div style={styles.linkColumn}>
            <h3 style={styles.columnTitle}>Support</h3>

            <a
              href="https://support.sliit.lk/"
              target="_blank"
              rel="noreferrer"
              style={styles.supportLink}
            >
              SLIIT Support Portal
            </a>

            <p style={styles.supportText}>Email: support@sliit.lk</p>
            <p style={styles.supportText}>Location: SLIIT Main Campus</p>
            <p style={styles.supportText}>Available for student support</p>
          </div>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <p style={styles.bottomText}>
          © {currentYear} UniFind. All rights reserved.
        </p>
        <p style={styles.bottomText}>Designed for a smarter campus experience.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "50px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderRadius: "28px",
    padding: "34px 32px 20px",
    color: "#ffffff",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
  },

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },

  brandSection: {
    flex: "1 1 360px",
    minWidth: "280px",
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    padding: "6px",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  brandTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#ffffff",
  },

  brandText: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#cbd5e1",
    maxWidth: "420px",
  },

  brandDescription: {
    marginTop: "18px",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "#94a3b8",
    maxWidth: "520px",
  },

  socialRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
  },

  socialButton: {
    textDecoration: "none",
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
    transition: "0.2s ease",
  },

  linksWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
    gap: "28px",
    flex: "1 1 500px",
    minWidth: "300px",
  },

  linkColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  columnTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "6px",
  },

  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: 0,
    textAlign: "left",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  supportLink: {
    textDecoration: "none",
    color: "#f97316",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: 1.7,
  },

  supportText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: 1.7,
  },

  bottomSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    paddingTop: "18px",
  },

  bottomText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.6,
  },
};

export default Footer;