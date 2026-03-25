import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="login"
      title="Sign in to your account"
      subtitle="Access your member dashboard and continue managing lost and found activity."
      footerText="Don’t have an account?"
      footerLinkText="Create one here"
      footerLinkTo="/"
    >
      <form className="uf-form" onSubmit={handleSubmit}>
        <div className="uf-field">
          <div className="uf-label-row">
            <label className="uf-label" htmlFor="email">
              Email Address
            </label>
          </div>

          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
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
          <div className="uf-label-row">
            <label className="uf-label" htmlFor="password">
              Password
            </label>
            <span className="uf-inline-link">Forgot password?</span>
          </div>

          <div className="uf-input-wrap">
            <span className="uf-input-icon">
              <svg
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
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
        </div>

        <div className="uf-checkbox-row">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">
            Keep me signed in on this device for a smoother return experience.
          </label>
        </div>

        {error && (
          <div className="uf-alert error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="uf-submit" disabled={loading}>
          <span className="uf-submit-inner">
            {loading && <span className="uf-spinner" />}
            {loading ? "Signing in…" : "Sign In"}
          </span>
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;