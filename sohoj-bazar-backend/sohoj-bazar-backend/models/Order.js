const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.1 },
  unit: { type: String, default: "কেজি" },
  unitPrice: { type: Number, required: true },
  cuttingStyle: { type: String, default: "পুরো" },
  cuttingCharge: { type: Number, default: 0 },
  customInstruction: { type: String, default: "", maxlength: 500 },
  subtotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], validate: v => v.length > 0 },
  deliveryAddress: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, default: "বগুড়া" }
  },
  deliveryDate: { type: Date, required: true },
  deliveryCharge: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cod", "bkash", "nagad"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "unpaid"],
    default: "pending"
  },
  transactionId: { type: String, default: "" },
  orderStatus: {
    type: String,
    enum: ["নতুন", "নিশ্চিত", "প্রস্তুত হচ্ছে", "কাটা হচ্ছে", "প্যাক করা হয়েছে", "ডেলিভারির পথে", "ডেলিভারড", "বাতিল"],
    default: "নতুন"
  },
  customerNote: { type: String, default: "", maxlength: 1000 },
  cancelledReason: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
