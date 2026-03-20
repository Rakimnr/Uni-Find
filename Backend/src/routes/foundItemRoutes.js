import express from "express";
import {
  getFoundItems,
  getFoundItemById,
  createFoundItem,
  updateFoundItem,
  updateFoundItemStatus,
} from "../controller/foundItemController.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all items + CREATE new item with image upload
router
  .route("/")
  .get(getFoundItems)
  .post(upload.single("image"), createFoundItem);

// GET single item + UPDATE item
router
  .route("/:id")
  .get(getFoundItemById)
  .put(updateFoundItem);

// UPDATE status
router
  .route("/:id/status")
  .patch(updateFoundItemStatus);

export default router;