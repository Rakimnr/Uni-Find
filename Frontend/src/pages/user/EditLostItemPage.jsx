import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLostItemById, updateLostItem } from "../../api/lostApi.js";

function EditLostItemPage() {
  const { id } = useParams();
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
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
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

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await getLostItemById(id);
        const item = result?.data || {};

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
          image: null,
        });

        setExistingImage(item.image || "");
      } catch (err) {
        setError("Failed to load lost item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, initialFormData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Item title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.lostLocation.trim()) {
      newErrors.lostLocation = "Lost location is required.";
    }

    if (!formData.dateLost) {
      newErrors.dateLost = "Date lost is required.";
    } else if (formData.dateLost > today) {
      newErrors.dateLost = "Date lost cannot be in the future.";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required.";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    if (formData.contactPhone.trim()) {
      const cleanedPhone = formData.contactPhone.replace(/\s+/g, "");
      if (!/^[0-9+()-]{7,15}$/.test(cleanedPhone)) {
        newErrors.contactPhone = "Enter a valid phone number.";
      }
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

    setError("");
    setMessage("");
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

    setError("");
    setMessage("");

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    if (!validate()) {
      setSaving(false);
      return;
    }

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

      await updateLostItem(id, submitData);
      setMessage("Lost report updated successfully.");

      setTimeout(() => {
        navigate("/lost-reports");
      }, 900);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update lost report."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderFieldError = (fieldName) =>
    errors[fieldName] ? (
      <p style={styles.fieldError}>{errors[fieldName]}</p>
    ) : null;

  if (loading) {
    return <div style={styles.stateText}>Loading lost item...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.badgeTop}>Lost Item Portal</p>
            <h1 style={styles.heading}>Edit Lost Report</h1>
            <p style={styles.subText}>
              Update the lost item details below.
            </p>
          </div>

          <div style={styles.topButtons}>
            <Link to="/" style={styles.secondaryButton}>
              Home
            </Link>
            <Link to="/lost-reports" style={styles.backButton}>
              Back to Reports
            </Link>
          </div>
        </div>

        <div style={styles.formCard}>
          {message && <div style={styles.successBox}>{message}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

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
                  disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                  max={today}
                />
                {renderFieldError("dateLost")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Current / New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
                disabled={saving}
              />
              {renderFieldError("image")}

              {imagePreview ? (
                <div style={styles.previewBox}>
                  <img
                    src={imagePreview}
                    alt="New preview"
                    style={styles.previewImage}
                  />
                </div>
              ) : existingImage ? (
                <div style={styles.previewBox}>
                  <img
                    src={`http://localhost:5001${existingImage}`}
                    alt="Current item"
                    style={styles.previewImage}
                  />
                </div>
              ) : null}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Unique Features</label>
              <textarea
                name="uniqueFeatures"
                placeholder="Ex: Scratch near zip, yellow keychain..."
                value={formData.uniqueFeatures}
                onChange={handleChange}
                style={styles.textareaSmall}
                disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
              />
              {renderFieldError("contactPhone")}
            </div>

            <div style={styles.bottomActions}>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(saving ? styles.submitButtonDisabled : {}),
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Report"}
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
  topBar: {
    backgroundColor: "#ffffff",
    border: "1px solid #eef2f7",
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
  badgeTop: {
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
  },
  topButtons: {
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
  backButton: {
    textDecoration: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: "700",
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
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default EditLostItemPage;