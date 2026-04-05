import { useEffect, useState } from "react";
import { getMyClaims } from "../../api/claimApi";

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getMyClaims();
        setClaims(data.claims || []);
      } catch (err) {
        setError("Failed to load claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "rejected") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  };

  if (loading) {
    return <div style={styles.stateText}>Loading claims...</div>;
  }

  if (error) {
    return <div style={styles.stateText}>{error}</div>;
  }

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={styles.heading}>My Claims</h1>
          <p style={styles.subText}>
            Track the status of items you have claimed.
          </p>
        </div>

        <div style={styles.headerRight}>
          <button style={styles.notificationButton}>🔔</button>

          <div style={styles.profileBox}>
            <div style={styles.profileTextBox}>
              <span style={styles.profileName}>Binusha</span>
              <span style={styles.profileRole}>Student • UniFind</span>
            </div>
            <div style={styles.profileAvatar}>H</div>
          </div>
        </div>
      </div>

      {claims.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3 style={styles.emptyTitle}>No claims yet</h3>
          <p style={styles.emptyText}>
            You have not submitted any claim requests yet.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {claims.map((claim) => {
            const itemImage = claim.itemId?.image
              ? `http://localhost:5001${claim.itemId.image}`
              : "https://via.placeholder.com/300x180?text=Claimed+Item";

            return (
              <div key={claim._id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(claim.status),
                    }}
                  >
                    {claim.status?.toUpperCase()}
                  </span>

                  <img
                    src={itemImage}
                    alt={claim.itemId?.title || "Claimed item"}
                    style={styles.image}
                  />
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {claim.itemId?.title || "Unknown Item"}
                  </h3>

                  <p style={styles.meta}>
                    <strong>Lost Location:</strong>{" "}
                    {claim.lostLocation || "Unknown"}
                  </p>

                  <p style={styles.meta}>
                    <strong>Lost Date:</strong> {formatDate(claim.lostDate)}
                  </p>

                  <p style={styles.meta}>
                    <strong>Claimed On:</strong> {formatDate(claim.createdAt)}
                  </p>

                  <p style={styles.reason}>
                    <strong>Reason:</strong> {claim.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  heading: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
    fontWeight: "700",
  },
  subText: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginLeft: "auto",
  },
  notificationButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "8px 12px",
  },
  profileTextBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
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
  profileAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#fed7aa",
    color: "#9a3412",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 340px))",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  imageWrapper: {
    position: "relative",
    height: "180px",
    backgroundColor: "#f3f4f6",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  statusBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 1,
  },
  cardContent: {
    padding: "16px",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },
  meta: {
    fontSize: "14px",
    color: "#4b5563",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  reason: {
    fontSize: "14px",
    color: "#374151",
    marginTop: "12px",
    lineHeight: "1.6",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "32px",
    maxWidth: "500px",
  },
  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    color: "#111827",
  },
  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
  },
  stateText: {
    padding: "40px",
    fontSize: "18px",
    color: "#6b7280",
  },
};

export default MyClaimsPage;