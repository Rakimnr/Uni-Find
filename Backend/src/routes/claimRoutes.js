import express from "express";
import {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} from "../controller/claimController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER: create a claim
router.post("/", createClaim);

// USER: view own claims
router.get("/my", getMyClaims);

// ADMIN: view all claims
router.get("/", protectAdmin, getAllClaims);

// ADMIN: approve/reject claim
router.patch("/:id/status", protectAdmin, updateClaimStatus);

export default router;