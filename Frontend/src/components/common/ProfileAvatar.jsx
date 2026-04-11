function ProfileAvatar({ user, size = 40 }) {
  const imageUrl =
    user?.profileImage && user.profileImage.startsWith("http")
      ? user.profileImage
      : user?.profileImage
      ? `http://localhost:5001${user.profileImage}`
      : "";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user?.name || "Profile"}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid #e5e7eb",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: "#fed7aa",
        color: "#9a3412",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: `${Math.max(14, size * 0.38)}px`,
        flexShrink: 0,
      }}
    >
      {user?.fullName?.charAt(0)?.toUpperCase() ||
        user?.name?.charAt(0)?.toUpperCase() ||
        "U"}
    </div>
  );
}

export default ProfileAvatar;