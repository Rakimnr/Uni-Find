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

export const getClaimReport = async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: "pending" });
    const approvedClaims = await Claim.countDocuments({ status: "approved" });
    const rejectedClaims = await Claim.countDocuments({ status: "rejected" });

    // Get all claims for detailed reporting (not just recent 10)
    const allClaims = await Claim.find()
      .populate("itemId", "title category")
      .sort({ createdAt: -1 });

    // Get claims by month for trend analysis
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyClaims = await Claim.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get claims by category
    const categoryClaims = await Claim.aggregate([
      {
        $lookup: {
          from: "founditems",
          localField: "itemId",
          foreignField: "_id",
          as: "item",
        },
      },
      {
        $unwind: "$item",
      },
      {
        $group: {
          _id: "$item.category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get approval rate trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStats = await Claim.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      recentClaims: allClaims,
      monthlyClaims,
      categoryClaims,
      recentStats,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while generating claim report.",
      error: error.message,
    });
  }
};