import express from "express";
import {
  getLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  updateLostItemStatus,
  deleteLostItem,
} from "../controllers/lostItemController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(getLostItems).post(upload.single("image"), createLostItem);

router
  .route("/:id")
  .get(getLostItemById)
  .put(upload.single("image"), updateLostItem)
  .delete(deleteLostItem);

router.route("/:id/status").patch(updateLostItemStatus);

export default router;