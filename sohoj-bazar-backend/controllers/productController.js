const Product = require("../models/Product");

function slugify(text) {
  return text.toString().trim().toLowerCase()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function listProducts(req, res, next) {
  try {
    const { category, search, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (available !== "false") filter.isAvailable = true;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (e) { next(e); }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "সবজি পাওয়া যায়নি।" });
    res.json({ success: true, product });
  } catch (e) { next(e); }
}

async function createProduct(req, res, next) {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    data.slug = data.slug || slugify(data.name);
    const product = await Product.create(data);
    res.status(201).json({ success: true, message: "সবজি যোগ হয়েছে।", product });
  } catch (e) { next(e); }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...(req.body.name ? { slug: slugify(req.body.name) } : {}) },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "সবজি পাওয়া যায়নি।" });
    res.json({ success: true, message: "সবজির তথ্য আপডেট হয়েছে।", product });
  } catch (e) { next(e); }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "সবজি পাওয়া যায়নি।" });
    res.json({ success: true, message: "সবজি মুছে ফেলা হয়েছে।" });
  } catch (e) { next(e); }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
