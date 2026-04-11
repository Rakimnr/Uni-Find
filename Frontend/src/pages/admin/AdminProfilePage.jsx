import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/common/ProfileAvatar";
import { FiUpload } from "react-icons/fi";

const AdminProfilePage = () => {
  const { user, updateProfile, uploadProfileImage } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    faculty: "",
    department: "",
    batch: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        faculty: user.faculty || "",
        department: user.department || "",
        batch: user.batch || "",
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await updateProfile(formData);
      setSuccess(response?.message || "Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSuccess("");
    setError("");
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError("Please choose an image first.");
      return;
    }

    try {
      setUploadingImage(true);
      setSuccess("");
      setError("");

      const response = await uploadProfileImage(selectedImage);
      setSuccess(response?.message || "Profile image uploaded successfully");

      setSelectedImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to upload profile image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const displayName = user?.fullName || user?.name || "Admin";
  const displayRole = user?.role || "admin";

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>My Profile</h1>
          <p style={styles.subText}>
            View and update your admin account details.
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.topSection}>
          <div style={styles.avatarUploadColumn}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.previewImage}
              />
            ) : (
              <ProfileAvatar user={user} size={72} />
            )}

            <label style={styles.fileLabel}>
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.hiddenFileInput}
              />
            </label>

            <button
              type="button"
              style={styles.uploadButton}
              onClick={handleImageUpload}
              disabled={uploadingImage}
            >
              <FiUpload size={14} />
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>

            {selectedImage ? (
              <p style={styles.fileName}>{selectedImage.name}</p>
            ) : (
              <p style={styles.fileHint}>Optional admin photo</p>
            )}
          </div>

          <div>
            <h2 style={styles.name}>{displayName}</h2>
            <p style={styles.role}>{displayRole}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Faculty</label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Email</label>
              <input
                type="text"
                value={user?.email || ""}
                style={styles.readOnlyInput}
                readOnly
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Student ID</label>
              <input
                type="text"
                value={user?.studentId || ""}
                style={styles.readOnlyInput}
                readOnly
              />
            </div>

            <div style={styles.infoBox}>
              <label style={styles.label}>Role</label>
              <input
                type="text"
                value={user?.role || ""}
                style={styles.readOnlyInput}
                readOnly
              />
            </div>
          </div>

          {success && <div style={styles.successBox}>{success}</div>}
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "8px 0 24px 0",
  },
  header: {
    marginBottom: "24px",
  },
  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "8px",
  },
  subText: {
    margin: 0,
    fontSize: "15px",
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  },
  topSection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  avatarUploadColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  previewImage: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #f97316",
    display: "block",
  },
  fileLabel: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  hiddenFileInput: {
    display: "none",
  },
  uploadButton: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "10px 12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  fileName: {
    margin: 0,
    fontSize: "11px",
    color: "#6b7280",
    maxWidth: "140px",
    textAlign: "center",
    wordBreak: "break-word",
  },
  fileHint: {
    margin: 0,
    fontSize: "11px",
    color: "#94a3b8",
    textAlign: "center",
  },
  name: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  role: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  infoBox: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
  },
  label: {
    display: "block",
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },
  readOnlyInput: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    boxSizing: "border-box",
  },
  successBox: {
    marginTop: "20px",
    backgroundColor: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorBox: {
    marginTop: "20px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  },
  buttonRow: {
    marginTop: "22px",
    display: "flex",
    justifyContent: "flex-end",
  },
  saveButton: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default AdminProfilePage;