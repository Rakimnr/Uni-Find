export const protect = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Access denied. Please login first.",
    });
  }

  next();
};

export const protectAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Access denied. Please login first.",
    });
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  next();
};