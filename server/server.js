require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ================= DB ================= */
connectDB();

/* ================= CORS ================= */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);

      // Allow any Vercel preview/production deployment for this project
      const isVercelPreview = /https:\/\/job-flow-job-application.*\.vercel\.app$/.test(origin);

      // Allow exact matches from allowedOrigins list
      const isExactMatch = allowedOrigins.filter(Boolean).includes(origin);

      if (isVercelPreview || isExactMatch) {
        callback(null, true);
      } else {
        console.error(`❌ CORS blocked origin: ${origin}`);
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 JobFlow API is running",
    status: "OK",
    timestamp: new Date(),
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running 🚀",
    timestamp: new Date(),
  });
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Allowed CLIENT_URL: ${process.env.CLIENT_URL}`);
});