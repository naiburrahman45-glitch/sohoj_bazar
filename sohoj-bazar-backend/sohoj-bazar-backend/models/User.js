const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "নাম আবশ্যক।"], trim: true, maxlength: 100 },
  email: { type: String, required: [true, "ইমেইল আবশ্যক।"], unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 20 },
  password: { type: String, required: [true, "পাসওয়ার্ড আবশ্যক।"], minlength: 6, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  addresses: [{
    label: { type: String, default: "বাসা" },
    recipientName: String,
    phone: String,
    addressLine: String,
    area: String,
    city: { type: String, default: "বগুড়া" },
    isDefault: { type: Boolean, default: false }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
