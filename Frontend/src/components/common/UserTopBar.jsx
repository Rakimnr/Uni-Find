import { FiBell } from "react-icons/fi";

const UserTopBar = () => {
  return (
    <div style={styles.container}>
      <button style={styles.notificationButton}>
        <FiBell size={18} />
      </button>

      <div style={styles.profileBox}>
        <div style={styles.profileAvatar}>H</div>

        <div style={styles.profileTextBox}>
          <span style={styles.profileName}>Hashini</span>
          <span style={styles.profileRole}>UniFind User</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  notificationButton: {
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

  profileAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f97316",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  profileTextBox: {
    display: "flex",
    flexDirection: "column",
  },

  profileName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  profileRole: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

export default UserTopBar;