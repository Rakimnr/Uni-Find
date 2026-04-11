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
      const response = await login(formData);
      const loggedInUser = response?.user;

      if (loggedInUser?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
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
      title="Sign In to Your Account"
      subtitle="Access your member dashboard and continue managing lost and found activity."
      footerText="Don’t have an account?"
      footerLinkText="Create one here"
      footerLinkTo="/register"
    >
      <form className="uf-form" onSubmit={handleSubmit}>
        <div className="uf-field">
          <div className="uf-label-row">
            <label className="uf-label" htmlFor="email">
              Email Address
            </label>
          </div>

          <div className="uf-input-wrap">
            <span className="uf-input-icon">✉️</span>
            <input
              id="email"
              name="email"
              type="email"
              className="uf-input"
              placeholder="Enter your email address"
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
            <span className="uf-inline-link muted">Secure member login</span>
          </div>

          <div className="uf-input-wrap">
            <span className="uf-input-icon">🔒</span>
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
            {loading ? "Signing In..." : "Sign In"}
          </span>
        </button>
      </form>
    </AuthShell>
  );
}

export default LoginPage;