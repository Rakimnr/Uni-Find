import { useEffect, useState } from "react";
import { getAllClaims, updateClaimStatus } from "../../api/claimApi";

const AdminClaimReviewPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllClaims();
      setClaims(data.claims || []);
    } catch (err) {
      setError("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleStatusUpdate = async (claimId, status) => {
    try {
      setUpdatingId(claimId);
      await updateClaimStatus(claimId, status);
      await fetchClaims();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update claim status.");
    } finally {
      setUpdatingId("");
    }
  };

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
          <h1 style={styles.heading}>Claim Review</h1>
          <p style={styles.subText}>
            Review user claims and approve or reject them.
          </p>
        </div>
      </div>

      {claims.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3 style={styles.emptyTitle}>No claims available</h3>
          <p style={styles.emptyText}>There are no submitted claims right now.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {claims.map((claim) => {
            const itemImage = claim.itemId?.image
              ? `http://localhost:5001${claim.itemId.image}`
              : "https://via.placeholder.com/300x180?text=Claim+Review";

            const isUpdating = updatingId === claim._id;

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
                    alt={claim.itemId?.title || "Claim item"}
                    style={styles.image}
                  />
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {claim.itemId?.title || "Unknown Item"}
                  </h3>

                  <p style={styles.meta}>
                    <strong>Claimant:</strong> {claim.fullName}
                  </p>
                  <p style={styles.meta}>
                    <strong>Student ID:</strong> {claim.studentId}
                  </p>
                  <p style={styles.meta}>
                    <strong>Email:</strong> {claim.email}
                  </p>
                  <p style={styles.meta}>
                    <strong>Phone:</strong> {claim.phone || "Not provided"}
                  </p>
                  <p style={styles.meta}>
                    <strong>Lost Location:</strong> {claim.lostLocation}
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

                  <div style={styles.actions}>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.approveButton,
                        ...(isUpdating ? styles.disabledButton : {}),
                      }}
                      onClick={() => handleStatusUpdate(claim._id, "approved")}
                      disabled={isUpdating || claim.status === "approved"}
                    >
                      {isUpdating ? "Updating..." : "Approve"}
                    </button>

                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.rejectButton,
                        ...(isUpdating ? styles.disabledButton : {}),
                      }}
                      onClick={() => handleStatusUpdate(claim._id, "rejected")}
                      disabled={isUpdating || claim.status === "rejected"}
                    >
                      {isUpdating ? "Updating..." : "Reject"}
                    </button>
                  </div>
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
    marginBottom: "24px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 360px))",
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
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    flex: 1,
    border: "none",
    borderRadius: "10px",
    padding: "12px 14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  approveButton: {
    backgroundColor: "#16a34a",
    color: "white",
  },
  rejectButton: {
    backgroundColor: "#dc2626",
    color: "white",
  },
  disabledButton: {
    opacity: 0.7,
    cursor: "not-allowed",
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

export default AdminClaimReviewPage;