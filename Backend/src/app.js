import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foundItemRoutes from "./routes/foundItemRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/claims", claimRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/found-items", foundItemRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is started on PORT ${PORT}`);
  });
});