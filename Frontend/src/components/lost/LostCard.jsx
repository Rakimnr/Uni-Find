import { Link } from "react-router-dom";

function LostCard({ item, onDelete }) {
  const imageUrl = item?.image
    ? `http://localhost:5001${item.image}`
    : "";

  const getStatusStyle = (status) => {
    if (status === "open") {
      return {
        background: "rgba(34,197,94,0.12)",
        color: "#15803d",
        border: "1px solid rgba(34,197,94,0.18)",
      };
    }

    if (status === "possible_match") {
      return {
        background: "rgba(249,115,22,0.12)",
        color: "#c2410c",
        border: "1px solid rgba(249,115,22,0.18)",
      };
    }

    return {
      background: "rgba(100,116,139,0.12)",
      color: "#475569",
      border: "1px solid rgba(100,116,139,0.18)",
    };
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={item?.title || "Lost item"} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.placeholderIcon}>📦</span>
            <span style={styles.placeholderText}>No Image</span>
          </div>
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.topRow}>
          <div style={styles.titleWrap}>
            <h3 style={styles.title}>{item?.title || "Untitled Item"}</h3>
            <p style={styles.category}>{item?.category || "Other"}</p>
          </div>

          <span style={{ ...styles.statusBadge, ...getStatusStyle(item?.status) }}>
            {item?.status === "possible_match"
              ? "Possible Match"
              : item?.status || "Open"}
          </span>
        </div>

        <div style={styles.infoBlock}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Description</span>
            <p style={styles.infoTextClamp}>
              {item?.description || "No description provided."}
            </p>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Lost Location</span>
            <p style={styles.infoTextSingle}>
              {item?.lostLocation || "Not specified"}
            </p>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Date Lost</span>
            <p style={styles.infoTextSingle}>{formatDate(item?.dateLost)}</p>
          </div>
        </div>

        <div style={styles.actions}>
          <Link to={`/lost-reports/${item?._id}`} style={styles.viewBtn}>
            View
          </Link>

          <Link to={`/lost-reports/edit/${item?._id}`} style={styles.editBtn}>
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(item?._id)}
            style={styles.deleteBtn}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    height: "100%",
    minHeight: "455px",
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  imageWrap: {
    width: "100%",
    height: "190px",
    background: "#f8fafc",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    flexShrink: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#94a3b8",
    background:
      "linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)",
  },

  placeholderIcon: {
    fontSize: "34px",
  },

  placeholderText: {
    fontSize: "13px",
    fontWeight: "700",
  },

  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "16px",
  },

  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "14px",
  },

  titleWrap: {
    minWidth: 0,
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    lineHeight: 1.2,
    color: "#0f172a",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "48px",
  },

  category: {
    margin: "6px 0 0 0",
    fontSize: "12px",
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  infoBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "18px",
    minHeight: "150px",
  },

  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  infoLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  infoTextClamp: {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.55,
    color: "#334155",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "60px",
  },

  infoTextSingle: {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.5,
    color: "#334155",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  actions: {
    marginTop: "auto",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  viewBtn: {
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    border: "none",
  },

  editBtn: {
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#f59e0b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    border: "none",
  },

  deleteBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#ef4444",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
  },
};

export default LostCard;