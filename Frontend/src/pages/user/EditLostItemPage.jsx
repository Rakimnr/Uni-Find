import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLostItemById, updateLostItem } from "../../api/lostApi.js";

function EditLostItemPage() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const categories = [
    "Electronics",
    "Documents",
    "Bags",
    "Accessories",
    "Stationery",
    "Clothing",
    "Other",
  ];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await getLostItemById(id);
        const item = result.data;
        setFormData({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "",
          lostLocation: item.lostLocation || "",
          dateLost: item.dateLost ? item.dateLost.split("T")[0] : "",
          uniqueFeatures: item.uniqueFeatures || "",
          contactName: item.contactName || "",
          contactEmail: item.contactEmail || "",
          contactPhone: item.contactPhone || "",
          status: item.status || "open",
        });
      } catch {
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateLostItem(id, formData);
      setMessage("Lost report updated successfully.");
      setTimeout(() => navigate("/lost-reports"), 900);
    } catch {
      setError("Failed to update lost report.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.stateText}>Loading item...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>Edit Lost Report</h1>
          <p style={styles.subText}>Update the report details.</p>
        </div>

        <Link to="/lost-reports" style={styles.backButton}>
          Back
        </Link>
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
          />

          <textarea
            name="description"
            placeholder="Describe the lost item"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={styles.input}
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
          />

          <input
            type="date"
            name="dateLost"
            value={formData.dateLost}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="uniqueFeatures"
            placeholder="Unique features"
            value={formData.uniqueFeatures}
            onChange={handleChange}
            style={styles.textarea}
          />

          <input
            type="text"
            name="contactName"
            placeholder="Contact name"
            value={formData.contactName}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="contactPhone"
            placeholder="Contact phone"
            value={formData.contactPhone}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.submitButton} disabled={saving}>
            {saving ? "Saving..." : "Update Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f9fafb", padding: "30px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  heading: { margin: 0, fontSize: "32px", fontWeight: "800", color: "#111827" },
  subText: { margin: "8px 0 0 0", color: "#6b7280" },
  backButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    maxWidth: "800px",
    border: "1px solid #eceff3",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    minHeight: "110px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitButton: {
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
  success: { color: "green", marginBottom: "12px" },
  error: { color: "red", marginBottom: "12px" },
  stateText: { padding: "40px", fontSize: "18px", color: "#6b7280" },
};

export default EditLostItemPage;