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
      } catch {
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
        {/* Modern Header bar */}
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

        <form onSubmit={handleSubmit} style={styles.formLayout}>
          {message && <div style={styles.successBox}>✅ {message}</div>}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {/* SECTION 1: Item Details */}
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
                  style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
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
                style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
                disabled={saving}
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
                style={styles.textareaSmall}
                disabled={saving}
              />
            </div>
          </div>

          {/* SECTION 2: Location & Time */}
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
                  style={{ ...styles.input, ...(errors.lostLocation ? styles.inputError : {}) }}
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
                  style={{ ...styles.input, ...(errors.dateLost ? styles.inputError : {}) }}
                  disabled={saving}
                  max={today}
                />
                {renderFieldError("dateLost")}
              </div>
            </div>
          </div>

          {/* SECTION 3: Visuals */}
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
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInputHidden}
                    disabled={saving}
                  />
                </label>
              </div>
              {renderFieldError("image")}

              {/* Enhanced image preview rendering */}
              {(imagePreview || existingImage) && (
                <div style={styles.previewContainer}>
                  <p style={styles.previewLabel}>{imagePreview ? "New Image Preview:" : "Current Attached Image:"}</p>
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

          {/* SECTION 4: Contacts */}
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
                  style={{ ...styles.input, ...(errors.contactName ? styles.inputError : {}) }}
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
                style={styles.input}
                disabled={saving}
              />
              {renderFieldError("contactPhone")}
            </div>
          </div>

          {/* CTA Group */}
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
    background: "#f8fafc", // Cool grey background for enterprise feel
    padding: "40px 24px",
    boxSizing: "border-box",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  wrapper: {
    maxWidth: "800px", // Reduced width for easy visual scanning
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
    gap: "24px", // Spaces between sections
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
    transition: "all 0.2s ease",
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
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  submitButtonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    transform: "none",
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