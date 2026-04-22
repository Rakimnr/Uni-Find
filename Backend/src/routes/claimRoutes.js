import express from "express";
import {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
  getClaimReport,
} from "../controller/claimController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER: create a claim
router.post("/", createClaim);

// USER: view own claims
router.get("/my", getMyClaims);

// ADMIN: claim report
router.get("/report", protectAdmin, getClaimReport);

// ADMIN: view all claims
router.get("/", protectAdmin, getAllClaims);

// ADMIN: approve/reject claim
router.patch("/:id/status", protectAdmin, updateClaimStatus);

export default router;