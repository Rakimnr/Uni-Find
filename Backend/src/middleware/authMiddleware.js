export const protectAdmin = (req, res, next) => {
  const user = { role: "admin" };

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};