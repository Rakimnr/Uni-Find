import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLostItem } from "../../api/lostApi";

const ReportLostItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    lostLocation: "",
    dateLost: "",
    uniqueFeatures: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    status: "open",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Electronics",
    "Documents",
    "Bags",
    "Accessories",
    "Stationery",
    "Clothing",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      await createLostItem(formData);

      setMessage("Lost item report submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        lostLocation: "",
        dateLost: "",
        uniqueFeatures: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        status: "open",
      });

      setTimeout(() => {
        navigate("/lost-reports");
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit lost item report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topSection}>
        <h1 style={styles.heading}>Report Lost Item</h1>
        <p style={styles.subText}>Fill in the details of the item you lost inside the university.</p>
      </div>

      <div style={styles.formCard}>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Item title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <textarea
            name="description"
            placeholder="Describe the lost item"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
            disabled={submitting}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="lostLocation"
            placeholder="Lost location"
            value={formData.lostLocation}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="date"
            name="dateLost"
            value={formData.dateLost}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <textarea
            name="uniqueFeatures"
            placeholder="Unique features / identifying marks"
            value={formData.uniqueFeatures}
            onChange={handleChange}
            style={styles.textarea}
            disabled={submitting}
          />

          <input
            type="text"
            name="contactName"
            placeholder="Contact name"
            value={formData.contactName}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="text"
            name="contactPhone"
            placeholder="Contact phone"
            value={formData.contactPhone}
            onChange={handleChange}
            style={styles.input}
            disabled={submitting}
          />

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(submitting ? styles.submitButtonDisabled : {}),
            }}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Lost Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: 0 },
  topSection: { marginBottom: "22px" },
  heading: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
    fontWeight: "700",
  },
  subText: {
    marginTop: "8px",
    marginBottom: "18px",
    color: "#6b7280",
    fontSize: "15px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    maxWidth: "760px",
    width: "100%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eceff3",
    boxSizing: "border-box",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    minHeight: "110px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  submitButton: {
    marginTop: "6px",
    width: "100%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 16px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  success: {
    color: "green",
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "500",
  },
  error: {
    color: "red",
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

export default ReportLostItemPage;