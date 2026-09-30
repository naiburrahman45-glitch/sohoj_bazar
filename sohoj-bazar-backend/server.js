require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(v => v.trim()) : "*",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "অনেক বেশি অনুরোধ করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" }
});
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "সহজ বাজার API চালু আছে।",
    service: "Sohoj Bazar Backend",
    version: "1.0.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "সার্ভার ও API সচল আছে।" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`সহজ বাজার backend চলছে: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
