import LostItem from "../models/LostItem.js";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const getSessionUser = (req) => req.session?.user || null;

const isLegacyOwnerByEmail = (item, sessionUser) => {
  if (!item?.contactEmail || !sessionUser?.email) {
    return false;
  }

  return normalizeEmail(item.contactEmail) === normalizeEmail(sessionUser.email);
};

const canManageLostItem = (item, sessionUser) => {
  if (!item || !sessionUser) {
    return false;
  }

  const isAdmin = sessionUser.role === "admin";
  const isOwnerById =
    item.reportedBy && item.reportedBy.toString() === sessionUser.userId;
  const isOwnerByEmail = isLegacyOwnerByEmail(item, sessionUser);

  return isAdmin || isOwnerById || isOwnerByEmail;
};

export const getLostItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lostItems.length,
      data: lostItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lost items",
      error: error.message,
    });
  }
};

export const getMyLostItems = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const normalizedEmail = normalizeEmail(sessionUser.email || "");

    const lostItems = await LostItem.find({
      $or: [
        { reportedBy: sessionUser.userId },
        {
          reportedBy: { $exists: false },
          contactEmail: normalizedEmail,
        },
        {
          reportedBy: null,
          contactEmail: normalizedEmail,
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lostItems.length,
      data: lostItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your lost items",
      error: error.message,
    });
  }
};

export const getLostItemById = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lostItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lost item",
      error: error.message,
    });
  }
};

export const createLostItem = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newLostItem = await LostItem.create({
      reportedBy: sessionUser.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      lostLocation: req.body.lostLocation,
      dateLost: req.body.dateLost,
      uniqueFeatures: req.body.uniqueFeatures,
      contactName: req.body.contactName,
      contactEmail: normalizeEmail(req.body.contactEmail),
      contactPhone: req.body.contactPhone,
      status: req.body.status || "open",
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      message: "Lost item report created successfully",
      data: newLostItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create lost item report",
      error: error.message,
    });
  }
};

export const updateLostItem = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const existingItem = await LostItem.findById(req.params.id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    if (!canManageLostItem(existingItem, sessionUser)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own lost reports",
      });
    }

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      lostLocation: req.body.lostLocation,
      dateLost: req.body.dateLost,
      uniqueFeatures: req.body.uniqueFeatures,
      contactName: req.body.contactName,
      contactEmail: normalizeEmail(req.body.contactEmail),
      contactPhone: req.body.contactPhone,
      status: req.body.status || existingItem.status,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lost item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update lost item",
      error: error.message,
    });
  }
};

export const updateLostItemStatus = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const { status } = req.body;

    const existingItem = await LostItem.findById(req.params.id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    if (!canManageLostItem(existingItem, sessionUser)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own lost reports",
      });
    }

    const updatedItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Lost item status updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update lost item status",
      error: error.message,
    });
  }
};

export const deleteLostItem = async (req, res) => {
  try {
    const sessionUser = getSessionUser(req);

    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const existingItem = await LostItem.findById(req.params.id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    if (!canManageLostItem(existingItem, sessionUser)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own lost reports",
      });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lost item deleted successfully",
      data: existingItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lost item",
      error: error.message,
    });
  }
};