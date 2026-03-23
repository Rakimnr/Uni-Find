import express from "express";
import {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
} from "../controllers/lostItemController.js";

const router = express.Router();

router.post("/", createLostItem);
router.get("/", getAllLostItems);
router.get("/:id", getLostItemById);
router.put("/:id", updateLostItem);
router.delete("/:id", deleteLostItem);

export default router;