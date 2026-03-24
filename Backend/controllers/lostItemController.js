import LostItem from "../models/LostItem.js";

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
    const {
      title,
      description,
      category,
      lostLocation,
      dateLost,
      uniqueFeatures,
      contactName,
      contactEmail,
      contactPhone,
      status,
    } = req.body;

    const newLostItem = await LostItem.create({
      title,
      description,
      category,
      lostLocation,
      dateLost,
      uniqueFeatures,
      contactName,
      contactEmail,
      contactPhone,
      status: status || "open",
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
    const updatedItem = await LostItem.findByIdAndUpdate(
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
        message: "Lost item not found",
      });
    }

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
    const { status } = req.body;

    const updatedItem = await LostItem.findByIdAndUpdate(
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
        message: "Lost item not found",
      });
    }

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
    const deletedItem = await LostItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lost item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete lost item",
      error: error.message,
    });
  }
};