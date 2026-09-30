const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "লগইন করা প্রয়োজন।" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি বা অ্যাকাউন্ট নিষ্ক্রিয়।" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন।" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "এই কাজ করার অনুমতি আপনার নেই।" });
    }
    next();
  };
}

module.exports = { protect, authorize };
