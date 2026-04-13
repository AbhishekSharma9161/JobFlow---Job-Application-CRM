import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../../server/config/db.js";
import authRoutes from "../../server/routes/auth.routes.js";
import applicationRoutes from "../../server/routes/application.routes.js";
import errorHandler from "../../server/middleware/errorHandler.js";

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "https://job-tracker.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Error handler
app.use(errorHandler);

export default app;
