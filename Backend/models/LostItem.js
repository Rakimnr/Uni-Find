import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Documents",
        "Bags",
        "Accessories",
        "Stationery",
        "Clothing",
        "Other",
      ],
    },
    lostLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dateLost: {
      type: Date,
      required: true,
    },
    uniqueFeatures: {
      type: String,
      default: "",
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "possible_match", "claimed", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;