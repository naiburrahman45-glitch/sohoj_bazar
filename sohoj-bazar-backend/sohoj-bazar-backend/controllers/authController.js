const User = require("../models/User");
const createToken = require("../utils/token");

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses,
    isActive: user.isActive
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "নাম, ইমেইল ও পাসওয়ার্ড দিন।" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "এই ইমেইল দিয়ে অ্যাকাউন্ট আছে।" });

    const user = await User.create({ name, email, password, phone, role: "customer" });
    const token = createToken(user);

    res.status(201).json({ success: true, message: "রেজিস্ট্রেশন সফল হয়েছে।", token, user: publicUser(user) });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !user.isActive || !(await user.comparePassword(password || ""))) {
      return res.status(401).json({ success: false, message: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" });
    }

    const token = createToken(user);
    res.json({ success: true, message: "লগইন সফল হয়েছে।", token, user: publicUser(user) });
  } catch (e) { next(e); }
}

async function getMe(req, res) {
  res.json({ success: true, user: publicUser(req.user) });
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    await user.save();
    res.json({ success: true, message: "প্রোফাইল আপডেট হয়েছে।", user: publicUser(user) });
  } catch (e) { next(e); }
}

async function addAddress(req, res, next) {
  try {
    const { label, recipientName, phone, addressLine, area, city } = req.body;
    if (!recipientName || !phone || !addressLine || !area) {
      return res.status(400).json({ success: false, message: "ঠিকানার প্রয়োজনীয় তথ্য দিন।" });
    }
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses.push({ label, recipientName, phone, addressLine, area, city: city || "বগুড়া", isDefault: !!req.body.isDefault });
    await user.save();
    res.status(201).json({ success: true, message: "ঠিকানা যোগ হয়েছে।", addresses: user.addresses });
  } catch (e) { next(e); }
}

module.exports = { register, login, getMe, updateProfile, addAddress };
