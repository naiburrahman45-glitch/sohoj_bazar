require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

async function run() {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || "admin@sohojbazar.local").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const name = process.env.ADMIN_NAME || "সহজ বাজার অ্যাডমিন";

    let admin = await User.findOne({ email });
    if (admin) {
      admin.role = "admin";
      admin.name = name;
      admin.password = password;
      admin.isActive = true;
      await admin.save();
      console.log("Admin account updated.");
    } else {
      admin = await User.create({
        name, email, password,
        phone: "",
        role: "admin"
      });
      console.log("Admin account created.");
    }

    console.log(`Email: ${email}`);
    console.log("Password: .env-এর ADMIN_PASSWORD অনুযায়ী");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
