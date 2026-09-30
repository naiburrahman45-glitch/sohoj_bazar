const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "সবজির নাম আবশ্যক।"], trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  category: {
    type: String,
    enum: ["শাকসবজি", "আলু-পেঁয়াজ", "মৌসুমি", "পাতাযুক্ত", "অন্যান্য"],
    default: "শাকসবজি"
  },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  basePrice: { type: Number, required: true, min: 0 },
  unit: { type: String, default: "কেজি" },
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  cuttingOptions: [{
    name: String,
    extraCharge: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
