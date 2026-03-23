import LostItem from "../models/LostItem.js";

export const createLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.create(req.body);
    res.status(201).json(lostItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLostItem = async (req, res) => {
  try {
    const item = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json({ message: "Lost item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};