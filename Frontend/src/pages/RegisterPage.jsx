import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import "../styles/auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  };

  const strength = useMemo(() => getStrength(formData.password), [formData.password]);

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!acceptedTerms) {
      setError("Please agree to the terms before creating an account.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(formData);
      setMessage(data?.message || "Account created successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="register"
      title="Create your account"
      subtitle="Set up your member access to the UniFind lost and found portal."
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/login"
    >
      <form className="uf-form" onSubmit={handleSubmit}>
        <div className="uf-field">
          <label className="uf-label" htmlFor="fullName">
            Full Name
          </label>
          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="uf-input"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div className="uf-field">
          <label className="uf-label" htmlFor="email">
            Email Address
          </label>
          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              className="uf-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="uf-field">
          <label className="uf-label" htmlFor="password">
            Password
          </label>
          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="uf-input has-trailing"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="uf-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {formData.password && (
            <div className="uf-strength">
              <div className="uf-strength-bars">
                {[1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className="uf-strength-bar"
                    style={{
                      backgroundColor:
                        level <= strength ? strengthColors[strength] : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              <span
                className="uf-strength-label"
                style={{ color: strengthColors[strength] || "#94a3b8" }}
              >
                {strengthLabels[strength] || "Add a password"}
              </span>
            </div>
          )}
        </div>

        <div className="uf-field">
          <label className="uf-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="uf-input has-trailing"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="uf-toggle"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {formData.confirmPassword && (
            <span
              className="uf-match"
              style={{ color: passwordsMatch ? "#15803d" : "#b91c1c" }}
            >
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
            </span>
          )}
        </div>

        <div className="uf-checkbox-row">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            I agree to the portal terms and understand that my account will be used
            for reporting and managing lost and found items.
          </label>
        </div>

        {error && (
          <div className="uf-alert error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="uf-alert success" role="status">
            <span>✅</span>
            <span>{message} Redirecting…</span>
          </div>
        )}

        <button type="submit" className="uf-submit" disabled={loading}>
          <span className="uf-submit-inner">
            {loading && <span className="uf-spinner" />}
            {loading ? "Creating account…" : "Create Account"}
          </span>
        </button>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;