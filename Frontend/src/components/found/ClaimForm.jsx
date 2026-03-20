import { useState } from "react";

const ClaimForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    reason: "",
    lostLocation: "",
    lostDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.studentId ||
      !formData.email ||
      !formData.reason ||
      !formData.lostLocation ||
      !formData.lostDate
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Claim Item</h2>

      {error && <p style={styles.error}>{error}</p>}

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="studentId"
        placeholder="Student ID"
        value={formData.studentId}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number (optional)"
        value={formData.phone}
        onChange={handleChange}
        style={styles.input}
      />

      <textarea
        name="reason"
        placeholder="Why do you think this item is yours?"
        value={formData.reason}
        onChange={handleChange}
        style={styles.textarea}
      />

      <input
        type="text"
        name="lostLocation"
        placeholder="Where did you lose it?"
        value={formData.lostLocation}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="date"
        name="lostDate"
        value={formData.lostDate}
        onChange={handleChange}
        style={styles.input}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "700px",
    margin: "20px auto",
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  heading: {
    marginBottom: "8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  textarea: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    minHeight: "120px",
    resize: "vertical",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#f97316",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "red",
    margin: 0,
  },
};

export default ClaimForm;