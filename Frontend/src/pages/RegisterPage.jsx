import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await register(formData);

      setMessage(data?.message || "Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.log("REGISTER FRONTEND ERROR:", err);
      console.log("REGISTER FRONTEND ERROR DATA:", err?.response?.data);

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
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {message && <p style={styles.successText}>{message}</p>}
        {error && <p style={styles.errorText}>{error}</p>}

        <p style={styles.bottomText}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "4px",
  },
  successText: {
    color: "green",
    marginTop: "14px",
    fontSize: "15px",
  },
  errorText: {
    color: "red",
    marginTop: "14px",
    fontSize: "15px",
  },
  bottomText: {
    marginTop: "16px",
    fontSize: "15px",
  },
};

export default RegisterPage;