import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLostItemById, updateLostItem } from "../../api/lostApi.js";

function EditLostItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
          contactEmail: (item.contactEmail || "").toLowerCase(),
          contactPhone: item.contactPhone || "",
          status: item.status || "open",
          image: null,
        });

        setExistingImage(item.image || "");
      } catch {
        setError("Failed to load lost item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, initialFormData]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
  const sanitizeName = (value) => value.replace(/[^A-Za-z\s.'-]/g, "");
  const sanitizePhone = (value) => value.replace(/[^\d+\s()-]/g, "");

  const validateField = (name, value, data = formData) => {
    switch (name) {
      case "title": {
        const clean = normalizeText(value || "");
        if (!clean) return "Item title is required.";
        if (clean.length < 3) return "Title must be at least 3 characters.";
        if (clean.length > 100) return "Title cannot exceed 100 characters.";
        return "";
      }

      case "description": {
        const clean = normalizeText(value || "");
        if (!clean) return "Description is required.";
        if (clean.length < 10) return "Description must be at least 10 characters.";
        if (clean.length > 1000) return "Description cannot exceed 1000 characters.";
        return "";
      }

      case "category": {
        if (!value) return "Please select a category.";
        if (!categories.includes(value)) return "Please choose a valid category.";
        return "";
      }

      case "lostLocation": {
        const clean = normalizeText(value || "");
        if (!clean) return "Lost location is required.";
        if (clean.length < 3) return "Lost location must be at least 3 characters.";
        if (clean.length > 120) return "Lost location cannot exceed 120 characters.";
        return "";
      }

      case "dateLost": {
        if (!value) return "Date lost is required.";
        if (value > today) return "Date lost cannot be in the future.";
        return "";
      }

      case "uniqueFeatures": {
        const clean = normalizeText(value || "");
        if (clean.length > 200) return "Unique features cannot exceed 200 characters.";
        return "";
      }

      case "contactName": {
        const clean = normalizeText(value || "");
        if (!clean) return "Contact name is required.";
        if (!/^[A-Za-z\s.'-]+$/.test(clean)) {
          return "Name can contain letters only.";
        }
        if (clean.length < 2) return "Name must be at least 2 characters.";
        if (clean.length > 60) return "Name cannot exceed 60 characters.";
        return "";
      }

      case "contactEmail": {
        const clean = normalizeText(value || "").toLowerCase();
        if (!clean) return "Contact email is required.";
        if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(clean)) {
          return "Enter a valid email address.";
        }
        return "";
      }

      case "contactPhone": {
        const clean = normalizeText(value || "");
        if (!clean) return "";
        const phone = clean.replace(/[\s()-]/g, "");
        if (!/^\+?\d{7,15}$/.test(phone)) {
          return "Enter a valid phone number.";
        }
        return "";
      }

      case "image": {
        if (!value) return "";
        if (!value.type.startsWith("image/")) {
          return "Only image files are allowed.";
        }
        if (value.size > 5 * 1024 * 1024) {
          return "Image size must be less than 5MB.";
        }
        return "";
      }

      default:
        return "";
    }
  };

  const validateForm = (data = formData) => {
    const newErrors = {};

    [
      "title",
      "description",
      "category",
      "lostLocation",
      "dateLost",
      "uniqueFeatures",
      "contactName",
      "contactEmail",
      "contactPhone",
      "image",
    ].forEach((field) => {
      const errorText = validateField(field, data[field], data);
      if (errorText) newErrors[field] = errorText;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "contactName") value = sanitizeName(value);
    if (name === "contactPhone") value = sanitizePhone(value);
    if (name === "contactEmail") value = value.toLowerCase().replace(/\s+/g, "");

    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);
    setError("");
    setMessage("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, updated),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    const imageError = validateField("image", file);

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setErrors((prev) => ({
      ...prev,
      image: imageError,
    }));

    setError("");
    setMessage("");

    if (file && !imageError) {
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

    const cleanedData = {
      ...formData,
      title: normalizeText(formData.title),
      description: normalizeText(formData.description),
      lostLocation: normalizeText(formData.lostLocation),
      uniqueFeatures: normalizeText(formData.uniqueFeatures),
      contactName: normalizeText(formData.contactName),
      contactEmail: normalizeText(formData.contactEmail).toLowerCase(),
      contactPhone: normalizeText(formData.contactPhone),
    };

    setFormData(cleanedData);

    if (!validateForm(cleanedData)) {
      setSaving(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", cleanedData.title);
      submitData.append("description", cleanedData.description);
      submitData.append("category", cleanedData.category);
      submitData.append("lostLocation", cleanedData.lostLocation);
      submitData.append("dateLost", cleanedData.dateLost);
      submitData.append("uniqueFeatures", cleanedData.uniqueFeatures);
      submitData.append("contactName", cleanedData.contactName);
      submitData.append("contactEmail", cleanedData.contactEmail);
      submitData.append("contactPhone", cleanedData.contactPhone);
      submitData.append("status", cleanedData.status);

      if (cleanedData.image) {
        submitData.append("image", cleanedData.image);
      }

      await updateLostItem(id, submitData);
      setMessage("Lost report updated successfully.");

      setTimeout(() => {
        navigate("/lost-reports");
      }, 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update lost report.");
    } finally {
      setSaving(false);
    }
  };

  const renderFieldError = (fieldName) =>
    errors[fieldName] ? <p style={styles.fieldError}>{errors[fieldName]}</p> : null;

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.stateText}>Retrieving report details...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.topBar}>
          <div>
            <span style={styles.badgeTop}>Editing Report</span>
            <h1 style={styles.heading}>Update Lost Item</h1>
            <p style={styles.subText}>Make changes to your lost item record below.</p>
          </div>

          <div style={styles.topButtons}>
            <Link to="/" style={styles.secondaryButton}>Home</Link>
            <Link to="/lost-reports" style={styles.backButton}>View Reports</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.formLayout} noValidate>
          {message && <div style={styles.successBox}>✅ {message}</div>}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <div style={styles.cardSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📦</span>
              <div>
                <h2 style={styles.sectionTitle}>Basic Information</h2>
                <p style={styles.sectionSubText}>Describe the item that was lost.</p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Item Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Brown leather wallet"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
                  disabled={saving}
                  maxLength={100}
                />
                {renderFieldError("title")}
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ ...styles.input, ...(errors.category ? styles.inputError : {}) }}
                  disabled={saving}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {renderFieldError("category")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                placeholder="Include brand, color, contents inside..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
                disabled={saving}
                maxLength={1000}
              />
              {renderFieldError("description")}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Unique Features (Optional)</label>
              <textarea
                name="uniqueFeatures"
                placeholder="Ex: Scratch on side, specific sticker..."
                value={formData.uniqueFeatures}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ ...styles.textareaSmall, ...(errors.uniqueFeatures ? styles.inputError : {}) }}
                disabled={saving}
                maxLength={200}
              />
              {renderFieldError("uniqueFeatures")}
            </div>
          </div>

          <div style={styles.cardSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📍</span>
              <div>
                <h2 style={styles.sectionTitle}>Location & Timeline</h2>
                <p style={styles.sectionSubText}>Where and when did it go missing?</p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Lost Location *</label>
                <input
                  type="text"
                  name="lostLocation"
                  placeholder="Ex: Student Union Cafe"
                  value={formData.lostLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ ...styles.input, ...(errors.lostLocation ? styles.inputError : {}) }}
                  disabled={saving}
                  maxLength={120}
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
                  onBlur={handleBlur}
                  style={{ ...styles.input, ...(errors.dateLost ? styles.inputError : {}) }}
                  disabled={saving}
                  max={today}
                />
                {renderFieldError("dateLost")}
              </div>
            </div>
          </div>

          <div style={styles.cardSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>🖼️</span>
              <div>
                <h2 style={styles.sectionTitle}>Item Visuals</h2>
                <p style={styles.sectionSubText}>Upload an image to help identify the item.</p>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.uploadBox}>
                <label style={styles.uploadLabel}>
                  <div style={styles.uploadPlaceholder}>
                    <span>Change or Upload Image</span>
                    <span style={styles.uploadHint}>Click to select file (PNG, JPG, Max 5MB)</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInputHidden}
                    disabled={saving}
                  />
                </label>
              </div>

              {renderFieldError("image")}

              {(imagePreview || existingImage) && (
                <div style={styles.previewContainer}>
                  <p style={styles.previewLabel}>
                    {imagePreview ? "New Image Preview:" : "Current Attached Image:"}
                  </p>
                  <div style={styles.previewBox}>
                    <img
                      src={imagePreview || `http://localhost:5001${existingImage}`}
                      alt="Lost Item"
                      style={styles.previewImage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.cardSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📞</span>
              <div>
                <h2 style={styles.sectionTitle}>Contact Information</h2>
                <p style={styles.sectionSubText}>How can finders reach you?</p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Contact Name *</label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="Your Name"
                  value={formData.contactName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ ...styles.input, ...(errors.contactName ? styles.inputError : {}) }}
                  disabled={saving}
                  maxLength={60}
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
                  onBlur={handleBlur}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  style={{ ...styles.input, ...(errors.contactEmail ? styles.inputError : {}) }}
                  disabled={saving}
                />
                {renderFieldError("contactEmail")}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Contact Phone (Optional)</label>
              <input
                type="text"
                name="contactPhone"
                placeholder="Ex: 07XXXXXXXX"
                value={formData.contactPhone}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ ...styles.input, ...(errors.contactPhone ? styles.inputError : {}) }}
                disabled={saving}
                maxLength={18}
              />
              {renderFieldError("contactPhone")}
            </div>
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
              {saving ? "Saving Changes..." : "Update Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 24px",
    boxSizing: "border-box",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  wrapper: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  badgeTop: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "#ffedd5",
    color: "#ea580c",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
  },
  subText: {
    margin: "4px 0 0 0",
    fontSize: "15px",
    color: "#64748b",
  },
  topButtons: {
    display: "flex",
    gap: "12px",
  },
  secondaryButton: {
    textDecoration: "none",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    padding: "11px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  backButton: {
    textDecoration: "none",
    backgroundColor: "#ea580c",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)",
  },
  formLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  cardSection: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  sectionHeader: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "24px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "18px",
  },
  sectionIcon: {
    fontSize: "24px",
    backgroundColor: "#f8fafc",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionSubText: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fff5f5",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    resize: "vertical",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  textareaSmall: {
    width: "100%",
    minHeight: "90px",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    resize: "vertical",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  uploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f8fafc",
  },
  uploadLabel: {
    cursor: "pointer",
    display: "block",
  },
  fileInputHidden: {
    display: "none",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "15px",
  },
  uploadHint: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#64748b",
  },
  previewContainer: {
    marginTop: "20px",
  },
  previewLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "8px",
  },
  previewBox: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "8px",
    backgroundColor: "#ffffff",
    width: "fit-content",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  previewImage: {
    width: "140px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "8px",
    display: "block",
  },
  fieldError: {
    margin: "6px 0 0 2px",
    fontSize: "13px",
    color: "#ef4444",
    fontWeight: "500",
  },
  successBox: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  bottomActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "12px",
    marginBottom: "40px",
  },
  submitButton: {
    border: "none",
    backgroundColor: "#ea580c",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(234, 88, 12, 0.3)",
  },
  submitButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  loadingWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    background: "#f8fafc",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#ea580c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  stateText: {
    fontSize: "16px",
    color: "#64748b",
    fontWeight: "500",
  },
};

export default EditLostItemPage;