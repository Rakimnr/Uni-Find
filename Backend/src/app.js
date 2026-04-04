import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { connectDB } from "./config/db.js";
import foundItemRoutes from "./routes/foundItemRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "unifind.sid",
    secret: process.env.SESSION_SECRET || "unifind_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/found-items", foundItemRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is started on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });