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
    itemDescription: "",
    uniqueFeature: "",
    contentsDescription: "",
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
      !formData.fullName.trim() ||
      !formData.studentId.trim() ||
      !formData.email.trim() ||
      !formData.reason.trim() ||
      !formData.lostLocation.trim() ||
      !formData.lostDate ||
      !formData.itemDescription.trim() ||
      !formData.uniqueFeature.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    onSubmit({
      ...formData,
      email: formData.email.trim().toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.section}>
        <h2 style={styles.heading}>Your Details</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="studentId"
            placeholder="Student ID *"
            value={formData.studentId}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email *"
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
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.heading}>About the Item</h2>

        <div style={styles.grid}>
          <input
            type="text"
            name="lostLocation"
            placeholder="Where did you lose it? *"
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
        </div>

        <textarea
          name="itemDescription"
          placeholder="Describe the item (color, brand, type, size, etc.) *"
          value={formData.itemDescription}
          onChange={handleChange}
          style={styles.textarea}
        />

        <textarea
          name="uniqueFeature"
          placeholder="Mention one unique feature, sticker, mark, or anything special about the item *"
          value={formData.uniqueFeature}
          onChange={handleChange}
          style={styles.textarea}
        />

        <textarea
          name="contentsDescription"
          placeholder="What was inside the item? (optional)"
          value={formData.contentsDescription}
          onChange={handleChange}
          style={styles.textareaSmall}
        />

        <textarea
          name="reason"
          placeholder="Why do you think this item is yours? *"
          value={formData.reason}
          onChange={handleChange}
          style={styles.textarea}
        />
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "900px",
    margin: "20px auto",
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  heading: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
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
    minHeight: "110px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  textareaSmall: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    minHeight: "90px",
    resize: "vertical",
    fontFamily: "inherit",
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
    alignSelf: "flex-start",
    minWidth: "170px",
  },
  error: {
    color: "red",
    margin: 0,
  },
};

export default ClaimForm;