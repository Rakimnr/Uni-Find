import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Welcome</h1>
        <p><strong>Name:</strong> {user?.fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>

        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default DashboardPage;