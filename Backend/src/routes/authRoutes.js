import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateCurrentUser,
  uploadCurrentUserProfileImage,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import uploadProfileImage from "../middleware/uploadProfileImage.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateCurrentUser);

// NEW
router.put(
  "/me/profile-image",
  protect,
  uploadProfileImage.single("profileImage"),
  uploadCurrentUserProfileImage
);

export default router;