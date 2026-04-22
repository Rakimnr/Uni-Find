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

    if (!req.session || !req.session.user || !req.session.user.userId) {
      return res.status(401).json({
        message: "Access denied. Please login first.",
      });
    }

    const newClaim = new Claim({
      userId: req.session.user.userId,
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
    if (!req.session || !req.session.user || !req.session.user.userId) {
      return res.status(401).json({
        message: "Access denied. Please login first.",
      });
    }

    const claims = await Claim.find({
      userId: req.session.user.userId,
    })
      .populate("itemId", "title image foundLocation dateFound status category")
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
      .populate("itemId", "title image foundLocation dateFound status category")
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

export const getClaimReport = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("itemId", "title category")
      .sort({ createdAt: -1 });

    const totalClaims = claims.length;
    const pendingClaims = claims.filter(
      (claim) => claim.status === "pending"
    ).length;
    const approvedClaims = claims.filter(
      (claim) => claim.status === "approved"
    ).length;
    const rejectedClaims = claims.filter(
      (claim) => claim.status === "rejected"
    ).length;

    const monthlyMap = {};
    const categoryMap = {};

    claims.forEach((claim) => {
      const createdAt = new Date(claim.createdAt);

      if (!Number.isNaN(createdAt.getTime())) {
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth() + 1;
        const monthKey = `${year}-${String(month).padStart(2, "0")}`;

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            _id: { year, month },
            count: 0,
          };
        }

        monthlyMap[monthKey].count += 1;
      }

      const category = claim.itemId?.category || "Unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const monthlyClaims = Object.values(monthlyMap).sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });

    const categoryClaims = Object.entries(categoryMap).map(
      ([category, count]) => ({
        _id: category,
        count,
      })
    );

    const recentClaims = claims.slice(0, 10);

    res.status(200).json({
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      recentClaims,
      monthlyClaims,
      categoryClaims,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching claim report.",
      error: error.message,
    });
  }
};