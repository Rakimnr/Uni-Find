import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClaimForm from "../../components/found/ClaimForm";
import { createClaim } from "../../api/claimApi";

const ClaimItemPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClaimSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      await createClaim({
        itemId,
        ...formData,
      });

      setMessage("Claim submitted successfully!");
      setTimeout(() => {
        navigate("/my-claims");
      }, 1200);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to submit claim."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Claim Found Item</h1>
      <p style={styles.subtitle}>
        Fill in the details below to request this item.
      </p>

      {message && <p style={styles.message}>{message}</p>}

      <ClaimForm onSubmit={handleClaimSubmit} loading={loading} />
    </div>
  );
};

const styles = {
  page: {
    padding: "24px",
  },
  title: {
    fontSize: "42px",
    marginBottom: "8px",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "20px",
    color: "#475569",
    marginBottom: "12px",
  },
  message: {
    maxWidth: "700px",
    margin: "0 auto 12px",
    color: "#16a34a",
    fontWeight: "600",
  },
};

export default ClaimItemPage;