import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
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
      trim: true,
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
    image: {
      type: String,
      default: "",
    },
    foundLocation: {
      type: String,
      required: [true, "Found location is required"],
      trim: true,
    },
    dateFound: {
      type: Date,
      required: [true, "Date found is required"],
    },
    storageLocation: {
      type: String,
      required: [true, "Storage location is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "available",
        "pending_verification",
        "approved_for_return",
        "returned",
        "expired",
        "archived",
      ],
      default: "available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const FoundItem = mongoose.model("FoundItem", foundItemSchema);

export default FoundItem;