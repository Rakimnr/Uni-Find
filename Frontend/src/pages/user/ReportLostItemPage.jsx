import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createLostItem } from "../../api/lostApi.js";

// --- Custom Icons ---
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

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

  const categories = ["Electronics", "Documents", "Bags", "Accessories", "Stationery", "Clothing", "Other"];
  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Item title is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.lostLocation.trim()) newErrors.lostLocation = "Lost location is required.";
    if (!formData.dateLost) {
      newErrors.dateLost = "Date lost is required.";
    } else if (formData.dateLost > today) {
      newErrors.dateLost = "Date lost cannot be in the future.";
    }
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required.";
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.contactEmail)) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    if (formData.image) {
      if (!formData.image.type.startsWith("image/")) newErrors.image = "Only images allowed.";
      if (formData.image.size > 5 * 1024 * 1024) newErrors.image = "Max size is 5MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
    setSubmitError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file || null }));
    setErrors((prev) => ({ ...prev, image: "" }));
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) submitData.append("image", formData[key]);
        else submitData.append(key, formData[key]);
      });

      await createLostItem(submitData);
      setMessage("Report submitted successfully.");
      setFormData(initialFormData);
      setImagePreview("");
      setTimeout(() => navigate("/lost-reports"), 1500);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* --- HEADER LAYER --- */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <Link to="/lost-reports" style={styles.backLink}>
              <BackIcon /> Back to Reports
            </Link>
            <h1 style={styles.title}>New Lost Report</h1>
            <p style={styles.subtitle}>Provide as much detail as possible to help recovery.</p>
          </div>
          <div style={styles.headerActions}>
            <Link to="/" style={styles.homeBtn}>Home</Link>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* --- LEFT COLUMN: ITEM DETAILS --- */}
          <div style={styles.mainCard}>
            <h2 style={styles.sectionHeading}>Item Details</h2>
            
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Item Title <span style={styles.required}>*</span></label>
              <input
                type="text" name="title" placeholder="e.g. Blue Nike Backpack"
                value={formData.title} onChange={handleChange}
                style={{...styles.input, ...(errors.title ? styles.inputError : {})}}
                disabled={submitting}
              />
              {errors.title && <p style={styles.errorText}>{errors.title}</p>}
            </div>

            <div style={styles.row}>
              <div style={{...styles.fieldGroup, flex: 1}}>
                <label style={styles.label}>Category <span style={styles.required}>*</span></label>
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  style={{...styles.select, ...(errors.category ? styles.inputError : {})}}
                  disabled={submitting}
                >
                  <option value="">Choose category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p style={styles.errorText}>{errors.category}</p>}
              </div>

              <div style={{...styles.fieldGroup, flex: 1}}>
                <label style={styles.label}>Date Lost <span style={styles.required}>*</span></label>
                <input
                  type="date" name="dateLost" max={today}
                  value={formData.dateLost} onChange={handleChange}
                  style={{...styles.input, ...(errors.dateLost ? styles.inputError : {})}}
                  disabled={submitting}
                />
                {errors.dateLost && <p style={styles.errorText}>{errors.dateLost}</p>}
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Lost Location <span style={styles.required}>*</span></label>
              <input
                type="text" name="lostLocation" placeholder="e.g. Main Library, 3rd Floor"
                value={formData.lostLocation} onChange={handleChange}
                style={{...styles.input, ...(errors.lostLocation ? styles.inputError : {})}}
                disabled={submitting}
              />
              {errors.lostLocation && <p style={styles.errorText}>{errors.lostLocation}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Description <span style={styles.required}>*</span></label>
              <textarea
                name="description" placeholder="Mention color, brand, and contents..."
                value={formData.description} onChange={handleChange}
                style={{...styles.textarea, ...(errors.description ? styles.inputError : {})}}
                disabled={submitting}
              />
              {errors.description && <p style={styles.errorText}>{errors.description}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Unique Features</label>
              <input
                type="text" name="uniqueFeatures" placeholder="e.g. Scratched corner, Batman sticker"
                value={formData.uniqueFeatures} onChange={handleChange}
                style={styles.input} disabled={submitting}
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: MEDIA & CONTACT --- */}
          <div style={styles.sideColumn}>
            <div style={styles.sideCard}>
              <h2 style={styles.sectionHeading}>Media & Image</h2>
              <div style={styles.imageUploadBox}>
                {imagePreview ? (
                  <div style={styles.previewContainer}>
                    <img src={imagePreview} alt="Preview" style={styles.previewImg} />
                    <button type="button" onClick={() => {setImagePreview(""); setFormData(p=>({...p, image:null}))}} style={styles.removeImgBtn}>Remove</button>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <p style={{margin:0, color:'#94a3b8'}}>Upload Item Photo</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={styles.hiddenFileInput} />
                    <button type="button" style={styles.fileDummyBtn}>Select File</button>
                  </div>
                )}
              </div>
              {errors.image && <p style={styles.errorText}>{errors.image}</p>}
            </div>

            <div style={styles.sideCard}>
              <h2 style={styles.sectionHeading}>Contact Info</h2>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Your Name <span style={styles.required}>*</span></label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address <span style={styles.required}>*</span></label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <div style={styles.actionBox}>
              {message && <div style={styles.successMsg}>{message}</div>}
              {submitError && <div style={styles.errorMsg}>{submitError}</div>}
              <button type="submit" style={styles.submitBtn} disabled={submitting}>
                {submitting ? "Processing..." : "Submit Report"}
              </button>
              <button type="button" onClick={() => {setFormData(initialFormData); setImagePreview("")}} style={styles.clearBtn}>
                Reset Form
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        input:focus, select:focus, textarea:focus { border-color: #f97316 !important; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1) !important; outline: none; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f8fafc", padding: "40px 20px" },
  container: { maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  backLink: { display: "flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "14px", marginBottom: "12px" },
  title: { fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
  subtitle: { color: "#64748b", fontSize: "16px", marginTop: "4px" },
  homeBtn: { padding: "10px 20px", borderRadius: "10px", backgroundColor: "#fff", border: "1px solid #e2e8f0", textDecoration: "none", color: "#0f172a", fontWeight: "600" },
  
  formGrid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" },
  mainCard: { backgroundColor: "#fff", padding: "32px", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)" },
  sideColumn: { display: "flex", flexDirection: "column", gap: "24px" },
  sideCard: { backgroundColor: "#fff", padding: "24px", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  
  sectionHeading: { fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" },
  fieldGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" },
  required: { color: "#ef4444" },
  row: { display: "flex", gap: "16px" },
  
  input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", backgroundColor: "#fcfcfd", boxSizing: "border-box" },
  select: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", backgroundColor: "#fcfcfd" },
  textarea: { width: "100%", minHeight: "120px", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", resize: "none", boxSizing: "border-box" },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  errorText: { color: "#ef4444", fontSize: "12px", marginTop: "4px", fontWeight: "500" },

  imageUploadBox: { border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "20px", textAlign: "center", position: "relative", backgroundColor: "#f8fafc" },
  uploadPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  hiddenFileInput: { position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", left: 0, top: 0 },
  fileDummyBtn: { padding: "8px 16px", borderRadius: "8px", backgroundColor: "#fff", border: "1px solid #e2e8f0", fontSize: "13px", fontWeight: "600" },
  previewContainer: { textAlign: "center" },
  previewImg: { width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "12px" },
  removeImgBtn: { marginTop: "10px", background: "none", border: "none", color: "#ef4444", fontSize: "13px", fontWeight: "600", cursor: "pointer" },

  actionBox: { display: "flex", flexDirection: "column", gap: "12px" },
  submitBtn: { padding: "16px", borderRadius: "14px", backgroundColor: "#f97316", color: "#fff", border: "none", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)" },
  clearBtn: { padding: "12px", borderRadius: "12px", backgroundColor: "transparent", border: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600", cursor: "pointer" },
  successMsg: { backgroundColor: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "10px", fontSize: "14px", textAlign: "center", fontWeight: "600" },
  errorMsg: { backgroundColor: "#fef2f2", color: "#991b1b", padding: "12px", borderRadius: "10px", fontSize: "14px", textAlign: "center", fontWeight: "600" },
};

export default ReportLostItemPage;