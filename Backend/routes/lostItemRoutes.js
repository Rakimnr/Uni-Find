import express from "express";
import {
  getLostItems,
  getLostItemById,
  createLostItem,
  updateLostItem,
  updateLostItemStatus,
  deleteLostItem,
} from "../controllers/lostItemController.js";

const router = express.Router();

router.route("/").get(getLostItems).post(createLostItem);

router.route("/:id").get(getLostItemById).put(updateLostItem).delete(deleteLostItem);

router.route("/:id/status").patch(updateLostItemStatus);

export default router;