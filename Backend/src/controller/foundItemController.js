import FoundItem from "../models/FoundItem.js";

const EXPIRE_DAYS = 30;

const expireOldAvailableItems = async () => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - EXPIRE_DAYS);

  await FoundItem.updateMany(
    {
      status: "available",
      dateFound: { $lt: cutoffDate },
    },
    {
      $set: { status: "expired" },
    }
  );
};

const normalizeText = (value = "") => value.trim().toLowerCase();

const normalizeDateOnly = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get all found items
// @route   GET /api/found-items
// @access  Public
export const getFoundItems = async (req, res) => {
  try {
    await expireOldAvailableItems();

    const foundItems = await FoundItem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foundItems.length,
      data: foundItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch found items",
      error: error.message,
    });
  }
};

// @desc    Get single found item by ID
// @route   GET /api/found-items/:id
// @access  Public
export const getFoundItemById = async (req, res) => {
  try {
    await expireOldAvailableItems();

    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: foundItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch found item",
      error: error.message,
    });
  }
};

// @desc    Create a new found item
// @route   POST /api/found-items
// @access  Public for now
export const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      foundLocation,
      dateFound,
      storageLocation,
      status,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !foundLocation?.trim() ||
      !dateFound ||
      !storageLocation?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const normalizedTitle = normalizeText(title);
    const normalizedCategory = normalizeText(category);
    const normalizedFoundLocation = normalizeText(foundLocation);
    const normalizedStorageLocation = normalizeText(storageLocation);
    const normalizedDate = normalizeDateOnly(dateFound);

    const startOfDay = new Date(normalizedDate);
    const endOfDay = new Date(normalizedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const similarItems = await FoundItem.find({
      category: new RegExp(`^${category.trim()}$`, "i"),
      dateFound: { $gte: startOfDay, $lte: endOfDay },
    });

    const duplicateItem = similarItems.find((item) => {
      return (
        normalizeText(item.title) === normalizedTitle &&
        normalizeText(item.category) === normalizedCategory &&
        normalizeText(item.foundLocation) === normalizedFoundLocation &&
        normalizeText(item.storageLocation) === normalizedStorageLocation
      );
    });

    if (duplicateItem) {
      return res.status(409).json({
        success: false,
        message:
          "A very similar found item already exists for the same date and location. Please review existing records before adding.",
      });
    }

    const newFoundItem = await FoundItem.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      image,
      foundLocation: foundLocation.trim(),
      dateFound,
      storageLocation: storageLocation.trim(),
      status: status || "available",
      createdBy: null,
    });

    res.status(201).json({
      success: true,
      message: "Found item created successfully",
      data: newFoundItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create found item",
      error: error.message,
    });
  }
};

// @desc    Update found item
// @route   PUT /api/found-items/:id
// @access  Public for now
export const updateFoundItem = async (req, res) => {
  try {
    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update found item",
      error: error.message,
    });
  }
};

// @desc    Update found item status only
// @route   PATCH /api/found-items/:id/status
// @access  Public for now
export const updateFoundItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found item status updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// @desc    Delete found item
// @route   DELETE /api/found-items/:id
// @access  Public for now
export const deleteFoundItem = async (req, res) => {
  try {
    const deletedItem = await FoundItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Found item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete found item",
      error: error.message,
    });
  }
};