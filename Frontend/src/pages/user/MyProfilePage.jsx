import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMail,
  FiPhone,
  FiUser,
  FiCreditCard,
  FiBookOpen,
  FiLayers,
  FiBriefcase,
  FiEdit2,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    faculty: "",
    department: "",
    batch: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const userName =
    user?.fullName || user?.name || user?.username || "User";
  const userRole = user?.role || "member";
  const userInitial = userName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        faculty: user.faculty || "",
        department: user.department || "",
        batch: user.batch || "",
      });
      setLoading(false);
    } else {
      setLoading(false);
      setError("Failed to load profile data.");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setSuccess("");
    setError("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      faculty: user?.faculty || "",
      department: user?.department || "",
      batch: user?.batch || "",
    });
    setSuccess("");
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateProfile(formData);
      setSuccess(response?.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const notifications = [
    {
      id: 1,
      title: "Profile Details",
      text: "You can now update your personal information here.",
    },
    {
      id: 2,
      title: "Account Access",
      text: "You are currently signed in to UniFind.",
    },
    {
      id: 3,
      title: "System Notice",
      text: "Email, student ID, and role cannot be edited.",
    },
  ];

  if (loading) {
    return <div style={styles.stateText}>Loading profile...</div>;
  }

  if (error && !user) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.heading}>My Profile</h1>
          <p style={styles.subText}>
            View and update your registered account information.
          </p>
        </div>

        <div style={styles.topBarRight}>
          <div style={styles.menuWrap} ref={notificationRef}>
            <button
              style={styles.iconButton}
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
            >
              <FiBell size={18} />
            </button>

            {showNotifications && (
              <div style={styles.dropdownMenu}>
                <p style={styles.dropdownTitle}>Notifications</p>

                {notifications.map((note) => (
                  <div key={note.id} style={styles.dropdownItemBlock}>
                    <p style={styles.dropdownItemTitle}>{note.title}</p>
                    <p style={styles.dropdownItemText}>{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.menuWrap} ref={profileRef}>
            <button
              style={styles.profileButton}
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
            >
              <div style={styles.profileBox}>
                <div style={styles.avatar}>{userInitial}</div>
                <div style={styles.profileTextWrap}>
                  <p style={styles.profileName}>{userName}</p>
                  <p style={styles.profileRole}>{userRole}</p>
                </div>
                <FiChevronDown size={16} color="#6b7280" />
              </div>
            </button>

            {showProfileMenu && (
              <div style={styles.profileDropdown}>
                <button
                  style={styles.dropdownAction}
                  onClick={() => navigate("/profile")}
                >
                  <FiUser size={16} />
                  <span>My Profile</span>
                </button>

                <button style={styles.dropdownAction} onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          <div style={styles.heroAvatar}>{userInitial}</div>
          <div>
            <h2 style={styles.heroName}>{user?.fullName || "User"}</h2>
            <p style={styles.heroRole}>
              {(user?.role || "member").toUpperCase()}
            </p>
            <p style={styles.heroEmail}>{user?.email || "No email"}</p>
          </div>
        </div>

        <button style={styles.editButton} onClick={handleEditClick}>
          <FiEdit2 size={16} />
          Edit Profile
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.detailsGrid}>
          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Personal Information</h3>
            </div>

            <div style={styles.infoList}>
              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiUser size={16} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={isEditing ? styles.input : styles.readOnlyInput}
                  readOnly={!isEditing}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiMail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="text"
                  value={user?.email || ""}
                  style={styles.readOnlyInput}
                  readOnly
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiPhone size={16} />
                  <span>Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={isEditing ? styles.input : styles.readOnlyInput}
                  readOnly={!isEditing}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiCreditCard size={16} />
                  <span>Student ID</span>
                </label>
                <input
                  type="text"
                  value={user?.studentId || ""}
                  style={styles.readOnlyInput}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Academic Information</h3>
            </div>

            <div style={styles.infoList}>
              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiBriefcase size={16} />
                  <span>Faculty</span>
                </label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  style={isEditing ? styles.input : styles.readOnlyInput}
                  readOnly={!isEditing}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiBookOpen size={16} />
                  <span>Department</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={isEditing ? styles.input : styles.readOnlyInput}
                  readOnly={!isEditing}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiLayers size={16} />
                  <span>Batch</span>
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  style={isEditing ? styles.input : styles.readOnlyInput}
                  readOnly={!isEditing}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.fieldLabel}>
                  <FiUser size={16} />
                  <span>Role</span>
                </label>
                <input
                  type="text"
                  value={user?.role || ""}
                  style={styles.readOnlyInput}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {success && <div style={styles.successBox}>{success}</div>}
        {error && user && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.actionsCard}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>

          <div style={styles.actionsRow}>
            {isEditing ? (
              <>
                <button
                  type="submit"
                  style={styles.primaryAction}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryAction}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={styles.primaryAction}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>

                <button
                  type="button"
                  style={styles.secondaryAction}
                  onClick={() => navigate("/my-claims")}
                >
                  View My Claims
                </button>

                <button
                  type="button"
                  style={styles.secondaryAction}
                  onClick={() => navigate("/")}
                >
                  Browse Items
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: {
    padding: "8px 0 24px 0",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
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
  menuWrap: {
    position: "relative",
  },
  iconButton: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  profileButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "8px 14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  profileTextWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
  },
  profileName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
    lineHeight: 1.2,
  },
  profileRole: {
    margin: "3px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.2,
    textTransform: "capitalize",
  },
  dropdownMenu: {
    position: "absolute",
    top: "56px",
    right: 0,
    width: "290px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    padding: "14px",
    zIndex: 100,
  },
  dropdownTitle: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  dropdownItemBlock: {
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  dropdownItemTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
    color: "#111827",
  },
  dropdownItemText: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  profileDropdown: {
    position: "absolute",
    top: "62px",
    right: 0,
    width: "200px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    padding: "10px",
    zIndex: 100,
  },
  dropdownAction: {
    width: "100%",
    border: "none",
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },
  heroCard: {
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
    border: "1px solid #fed7aa",
    borderRadius: "22px",
    padding: "24px",
    marginBottom: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  heroAvatar: {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "28px",
    flexShrink: 0,
  },
  heroName: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
  },
  heroRole: {
    margin: "6px 0 0 0",
    fontSize: "13px",
    color: "#ea580c",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  heroEmail: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },
  editButton: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  },
  cardHeader: {
    marginBottom: "14px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  fieldBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
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
    marginBottom: "18px",
    backgroundColor: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorBox: {
    marginBottom: "18px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  },
  actionsCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  },
  actionsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "16px",
  },
  primaryAction: {
    border: "none",
    backgroundColor: "#f97316",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryAction: {
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  stateText: {
    fontSize: "18px",
    color: "#6b7280",
    padding: "30px 0",
  },
};

export default MyProfilePage;