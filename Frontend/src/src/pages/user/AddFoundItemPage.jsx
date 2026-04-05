import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFoundItem } from "../../api/foundApi";

const AddFoundItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    foundLocation: "",
    dateFound: "",
    storageLocation: "",
    status: "available",
  });

  const [imageFile, setImageFile] = useState(null);
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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("foundLocation", formData.foundLocation);
      data.append("dateFound", formData.dateFound);
      data.append("storageLocation", formData.storageLocation);
      data.append("status", formData.status);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await createFoundItem(data);

      setMessage("Found item added successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        foundLocation: "",
        dateFound: "",
        storageLocation: "",
        status: "available",
      });

      setImageFile(null);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add found item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={styles.topSection}>
        <h1 style={styles.heading}>Report Found Item</h1>
        <p style={styles.subText}>
          Fill in the details of the item you found inside the university.
        </p>

        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
          disabled={submitting}
        >
          ← Back to Found Items
        </button>
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
            placeholder="Description"
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
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="text"
            name="foundLocation"
            placeholder="Found location"
            value={formData.foundLocation}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="date"
            name="dateFound"
            value={formData.dateFound}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={submitting}
          />

          <input
            type="text"
            name="storageLocation"
            placeholder="Storage location"
            value={formData.storageLocation}
            onChange={handleChange}
            required
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
            {submitting ? "Submitting..." : "Submit Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  topSection: {
    marginBottom: "22px",
  },
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
  backButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
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
    transition: "0.2s ease",
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

export default AddFoundItemPage;