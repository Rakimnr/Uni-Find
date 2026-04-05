import express from "express";
import {
  getFoundItems,
  searchFoundItems,
  getFoundItemById,
  createFoundItem,
  updateFoundItem,
  updateFoundItemStatus,
  deleteFoundItem,
} from "../controller/foundItemController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Search items
router.route("/search").get(searchFoundItems);

// GET all items + CREATE new item with image upload
router
  .route("/")
  .get(getFoundItems)
  .post(upload.single("image"), createFoundItem);

// GET single item + UPDATE item + DELETE item
router
  .route("/:id")
  .get(getFoundItemById)
  .put(updateFoundItem)
  .delete(deleteFoundItem);

// UPDATE status
router.route("/:id/status").patch(updateFoundItemStatus);

export default router;