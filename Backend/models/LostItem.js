import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
      required: [true, "Lost location is required"],
      trim: true,
    },
    dateLost: {
      type: Date,
      required: [true, "Date lost is required"],
    },
    uniqueFeatures: {
      type: String,
      default: "",
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "possible_match", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);

export default LostItem;