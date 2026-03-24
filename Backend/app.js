import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import lostItemRoutes from "./routes/lostItemRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error);
  });

app.get("/", (req, res) => {
  res.send("UniFind API running...");
});

app.use("/api/lost-items", lostItemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});