import Claim from "../models/claimModel.js";
import FoundItem from "../models/FoundItem.js";

export const createClaim = async (req, res) => {
  try {
    const {
      itemId,
      fullName,
      studentId,
      email,
      phone,
      reason,
      lostLocation,
      lostDate,
      itemDescription,
      uniqueFeature,
      contentsDescription,
    } = req.body;

    if (
      !itemId ||
      !fullName ||
      !studentId ||
      !email ||
      !reason ||
      !lostLocation ||
      !lostDate ||
      !itemDescription ||
      !uniqueFeature
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const newClaim = new Claim({
      itemId,
      fullName,
      studentId,
      email,
      phone,
      reason,
      lostLocation,
      lostDate,
      itemDescription,
      uniqueFeature,
      contentsDescription,
    });

    await newClaim.save();

    res.status(201).json({
      message: "Claim submitted successfully.",
      claim: newClaim,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating claim.",
      error: error.message,
    });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("itemId", "title image foundLocation dateFound status")
      .sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching claims.",
      error: error.message,
    });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("itemId", "title image foundLocation dateFound status")
      .sort({ createdAt: -1 });

    res.status(200).json({ claims });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching all claims.",
      error: error.message,
    });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
      });
    }

    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found.",
      });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await FoundItem.findByIdAndUpdate(claim.itemId, {
        status: "returned",
      });
    }

    if (status === "rejected") {
      await FoundItem.findByIdAndUpdate(claim.itemId, {
        status: "available",
      });
    }

    res.status(200).json({
      message: `Claim ${status} successfully.`,
      claim,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating claim status.",
      error: error.message,
    });
  }
};