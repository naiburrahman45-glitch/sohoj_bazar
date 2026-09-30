const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI .env ফাইলে পাওয়া যায়নি।");

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected:", mongoose.connection.host);
}

module.exports = connectDB;
