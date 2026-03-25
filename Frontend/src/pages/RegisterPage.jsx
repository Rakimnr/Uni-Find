import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import "../styles/auth.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;
const studentIdRegex = /^[A-Za-z0-9/-]{4,20}$/;

const facultyOptions = [
  "Computing",
  "Engineering",
  "Business",
  "Humanities & Sciences",
  "Architecture",
  "Other",
];

const batchOptions = [
  "Y1S1",
  "Y1S2",
  "Y2S1",
  "Y2S2",
  "Y3S1",
  "Y3S2",
  "Y4S1",
  "Y4S2",
  "Other",
];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    faculty: "",
    department: "",
    batch: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "studentId"
          ? value.toUpperCase()
          : value,
    }));
  };

  const passwordChecks = useMemo(
    () => ({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      special: /[^A-Za-z0-9]/.test(formData.password),
    }),
    [formData.password]
  );

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Very Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#f59e0b", "#3b82f6", "#22c55e"];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const isFormValid =
    formData.fullName.trim().length >= 3 &&
    emailRegex.test(formData.email.trim()) &&
    phoneRegex.test(formData.phone.trim()) &&
    studentIdRegex.test(formData.studentId.trim()) &&
    formData.faculty.trim() &&
    formData.department.trim().length >= 2 &&
    formData.batch.trim() &&
    Object.values(passwordChecks).every(Boolean) &&
    passwordsMatch &&
    acceptedTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isFormValid) {
      setError("Please complete all fields correctly before creating your account.");
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
      subtitle="Add your member details and get access to the UniFind portal."
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/login"
    >
      <form className="uf-form" onSubmit={handleSubmit}>
        <div className="uf-form-grid">
          <div className="uf-field uf-span-2">
            <label className="uf-label" htmlFor="fullName">
              Full Name
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">👤</span>
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

          <div className="uf-field uf-span-2">
            <label className="uf-label" htmlFor="email">
              Email Address
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">✉️</span>
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
            {formData.email && !emailRegex.test(formData.email.trim()) && (
              <span className="uf-field-hint">Enter a valid email address.</span>
            )}
          </div>

          <div className="uf-field">
            <label className="uf-label" htmlFor="phone">
              Phone Number
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">📞</span>
              <input
                id="phone"
                name="phone"
                type="text"
                className="uf-input"
                placeholder="0771234567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            {formData.phone && !phoneRegex.test(formData.phone.trim()) && (
              <span className="uf-field-hint">Use 10 to 15 digits, with optional + sign.</span>
            )}
          </div>

          <div className="uf-field">
            <label className="uf-label" htmlFor="studentId">
              Student ID
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">🪪</span>
              <input
                id="studentId"
                name="studentId"
                type="text"
                className="uf-input"
                placeholder="IT12345678"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>
            {formData.studentId && !studentIdRegex.test(formData.studentId.trim()) && (
              <span className="uf-field-hint">
                Use 4 to 20 characters. Letters, numbers, / and - only.
              </span>
            )}
          </div>

          <div className="uf-field">
            <label className="uf-label" htmlFor="faculty">
              Faculty
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">🏫</span>
              <select
                id="faculty"
                name="faculty"
                className="uf-select"
                value={formData.faculty}
                onChange={handleChange}
                required
              >
                <option value="">Select faculty</option>
                {facultyOptions.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="uf-field">
            <label className="uf-label" htmlFor="batch">
              Batch
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">📘</span>
              <select
                id="batch"
                name="batch"
                className="uf-select"
                value={formData.batch}
                onChange={handleChange}
                required
              >
                <option value="">Select batch</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="uf-field uf-span-2">
            <label className="uf-label" htmlFor="department">
              Department
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">🏷️</span>
              <input
                id="department"
                name="department"
                type="text"
                className="uf-input"
                placeholder="e.g. Information Technology"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="uf-field uf-span-2">
            <label className="uf-label" htmlFor="password">
              Password
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">🔒</span>
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
              <>
                <div className="uf-strength">
                  <div className="uf-strength-bars">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className="uf-strength-bar"
                        style={{
                          backgroundColor:
                            level <= passwordStrength
                              ? strengthColors[passwordStrength]
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="uf-strength-label"
                    style={{ color: strengthColors[passwordStrength] || "#94a3b8" }}
                  >
                    {strengthLabels[passwordStrength] || "Add a password"}
                  </span>
                </div>

                <div className="uf-note-list">
                  <span className={`uf-note-item ${passwordChecks.length ? "ok" : ""}`}>
                    • At least 8 characters
                  </span>
                  <span className={`uf-note-item ${passwordChecks.uppercase ? "ok" : ""}`}>
                    • At least one uppercase letter
                  </span>
                  <span className={`uf-note-item ${passwordChecks.lowercase ? "ok" : ""}`}>
                    • At least one lowercase letter
                  </span>
                  <span className={`uf-note-item ${passwordChecks.number ? "ok" : ""}`}>
                    • At least one number
                  </span>
                  <span className={`uf-note-item ${passwordChecks.special ? "ok" : ""}`}>
                    • At least one special character
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="uf-field uf-span-2">
            <label className="uf-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="uf-input-wrap">
              <span className="uf-input-icon">🛡️</span>
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
        </div>

        <div className="uf-checkbox-row">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            I confirm that the above information is correct and I agree to use this
            account only for the UniFind lost and found portal.
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

        <button type="submit" className="uf-submit" disabled={loading || !isFormValid}>
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