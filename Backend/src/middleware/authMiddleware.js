export const protectAdmin = (req, res, next) => {
  const user = req.user; // from token or session

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};