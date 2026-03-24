import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createLostItem } from "../../api/lostApi.js";

function ReportLostItemPage() {
  const navigate = useNavigate();

  const initialFormData = useMemo(
    () => ({
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
      image: null,
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
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

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Item title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.lostLocation.trim())
      newErrors.lostLocation = "Lost location is required.";
    if (!formData.dateLost) {
      newErrors.dateLost = "Date lost is required.";
    } else if (formData.dateLost > today) {
      newErrors.dateLost = "Date lost cannot be in the future.";
    }
    if (!formData.contactName.trim())
      newErrors.contactName = "Contact name is required.";
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    if (formData.image) {
      if (!formData.image.type.startsWith("image/")) {
        newErrors.image = "Only image files are allowed.";
      }
      if (formData.image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image size must be less than 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
    setSubmitError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      image: file || null,
    }));

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("lostLocation", formData.lostLocation);
      submitData.append("dateLost", formData.dateLost);
      submitData.append("uniqueFeatures", formData.uniqueFeatures);
      submitData.append("contactName", formData.contactName);
      submitData.append("contactEmail", formData.contactEmail);
      submitData.append("contactPhone", formData.contactPhone);
      submitData.append("status", formData.status);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await createLostItem(submitData);

      setMessage("Lost item report submitted successfully.");
      setFormData(initialFormData);
      setImagePreview("");
      setErrors({});

      setTimeout(() => {
        navigate("/lost-reports");
      }, 1000);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to submit lost item report."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldError = (fieldName) =>
    errors[fieldName] ? (
      <p style={styles.fieldError}>{errors[fieldName]}</p>
    ) : null;

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.headerCard}>
          <div>
            <p style={styles.badge}>Lost Item Portal</p>
            <h1 style={styles.heading}>Report Lost Item</h1>
            <p style={styles.subText}>
              Fill in the details clearly so the item can be identified faster.
            </p>
          </div>

          <div style={styles.headerButtons}>
            <Link to="/" style={styles.secondaryButton}>
              Home
            </Link>
            <Link to="/lost-reports" style={styles.primaryOutlineButton}>
              My Reports
            </Link>
          </div>
        </div>

        <div style={styles.formCard}>
          {message && <div style={styles.successBox}>{message}</div>}
          {submitError && <div style={styles.errorBox}>{submitError}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Item Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Black wallet"
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={submitting}
                />
                {renderFieldError("title")}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                {renderFieldError("category")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the lost item clearly..."
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                disabled={submitting}
              />
              {renderFieldError("description")}
            </div>

            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Lost Location *</label>
                <input
                  type="text"
                  name="lostLocation"
                  placeholder="Ex: Library 2nd floor"
                  value={formData.lostLocation}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={submitting}
                />
                {renderFieldError("lostLocation")}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Date Lost *</label>
                <input
                  type="date"
                  name="dateLost"
                  value={formData.dateLost}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={submitting}
                  max={today}
                />
                {renderFieldError("dateLost")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Item Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
                disabled={submitting}
              />
              {renderFieldError("image")}

              {imagePreview && (
                <div style={styles.previewBox}>
                  <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                </div>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Unique Features</label>
              <textarea
                name="uniqueFeatures"
                placeholder="Ex: Scratch near zip, yellow keychain..."
                value={formData.uniqueFeatures}
                onChange={handleChange}
                style={styles.textareaSmall}
                disabled={submitting}
              />
            </div>

            <div style={styles.sectionTitle}>Contact Information</div>

            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Contact Name *</label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="Your name"
                  value={formData.contactName}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={submitting}
                />
                {renderFieldError("contactName")}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="your@email.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={submitting}
                />
                {renderFieldError("contactEmail")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                placeholder="07XXXXXXXX"
                value={formData.contactPhone}
                onChange={handleChange}
                style={styles.input}
                disabled={submitting}
              />
            </div>

            <div style={styles.bottomActions}>
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setImagePreview("");
                  setErrors({});
                  setMessage("");
                  setSubmitError("");
                }}
                style={styles.clearButton}
                disabled={submitting}
              >
                Clear Form
              </button>

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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f9fafb 100%)",
    padding: "32px 20px",
    boxSizing: "border-box",
  },
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  badge: {
    display: "inline-block",
    margin: "0 0 10px 0",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    fontSize: "12px",
    fontWeight: "700",
  },
  heading: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    color: "#111827",
  },
  subText: {
    margin: "10px 0 0 0",
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.6",
    maxWidth: "600px",
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    textDecoration: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  primaryOutlineButton: {
    textDecoration: "none",
    backgroundColor: "#ffffff",
    color: "#f97316",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    border: "1px solid #f97316",
  },
  formCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #eef2f7",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  fileInput: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "130px",
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    resize: "vertical",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  textareaSmall: {
    width: "100%",
    minHeight: "100px",
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    resize: "vertical",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },
  previewBox: {
    marginTop: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "10px",
    backgroundColor: "#f9fafb",
    width: "fit-content",
  },
  previewImage: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    display: "block",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#111827",
    marginTop: "4px",
    marginBottom: "-4px",
  },
  fieldError: {
    margin: "6px 0 0 2px",
    fontSize: "13px",
    color: "#dc2626",
    fontWeight: "500",
  },
  successBox: {
    marginBottom: "16px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorBox: {
    marginBottom: "16px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  bottomActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    marginTop: "4px",
  },
  clearButton: {
    border: "none",
    backgroundColor: "#e5e7eb",
    color: "#111827",
    padding: "14px 18px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  submitButton: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    minWidth: "190px",
  },
  submitButtonDisabled: {
    opacity: 0.75,
    cursor: "not-allowed",
  },
};

export default ReportLostItemPage;