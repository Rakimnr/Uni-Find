import express from "express";
import {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} from "../controller/claimController.js";

const router = express.Router();

router.post("/", createClaim);
router.get("/my", getMyClaims);
router.get("/", getAllClaims);
router.patch("/:id/status", updateClaimStatus);

export default router;