import express from "express";
import {
  getLostItems,
  getMyLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  updateLostItemStatus,
  deleteLostItem,
} from "../controller/lostItemController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getLostItems);
router.get("/mine", protect, getMyLostItems);

router.post("/", protect, upload.single("image"), createLostItem);

router
  .route("/:id")
  .get(getLostItemById)
  .put(protect, upload.single("image"), updateLostItem)
  .delete(protect, deleteLostItem);

router.route("/:id/status").patch(protect, updateLostItemStatus);

export default router;