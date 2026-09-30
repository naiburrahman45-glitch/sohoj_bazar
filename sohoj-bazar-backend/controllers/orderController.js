const Order = require("../models/Order");
const Product = require("../models/Product");

function generateOrderNumber() {
  return `SB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function createOrder(req, res, next) {
  try {
    const { items, deliveryAddress, paymentMethod, transactionId, customerNote } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "কার্টে অন্তত একটি পণ্য থাকতে হবে।" });
    }

    if (!deliveryAddress?.recipientName || !deliveryAddress?.phone || !deliveryAddress?.addressLine || !deliveryAddress?.area) {
      return res.status(400).json({ success: false, message: "ডেলিভারি ঠিকানার সম্পূর্ণ তথ্য দিন।" });
    }

    if (!["cod", "bkash", "nagad"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "পেমেন্ট পদ্ধতি সঠিক নয়।" });
    }

    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable) {
        return res.status(400).json({ success: false, message: "একটি পণ্য বর্তমানে পাওয়া যাচ্ছে না।" });
      }
      if (Number(item.quantity) <= 0 || Number(item.quantity) > product.stock) {
        return res.status(400).json({ success: false, message: `${product.name}-এর পর্যাপ্ত স্টক নেই।` });
      }

      const cutting = (product.cuttingOptions || []).find(c => c.name === item.cuttingStyle);
      const cuttingCharge = cutting ? Number(cutting.extraCharge || 0) : 0;
      const unitPrice = Number(product.basePrice);
      const quantity = Number(item.quantity);
      const itemSubtotal = (unitPrice + cuttingCharge) * quantity;

      normalizedItems.push({
        product: product._id,
        name: product.name,
        quantity,
        unit: product.unit,
        unitPrice,
        cuttingStyle: item.cuttingStyle || "পুরো",
        cuttingCharge,
        customInstruction: item.customInstruction || "",
        subtotal: itemSubtotal
      });

      subtotal += itemSubtotal;
    }

    // বগুড়া শহরের জন্য সহজ ডেলিভারি নিয়ম: ৳৫০; ৳৫০০ বা তার বেশি হলে ফ্রি।
    const deliveryCharge = subtotal >= 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: normalizedItems,
      deliveryAddress: { ...deliveryAddress, city: "বগুড়া" },
      deliveryDate: startOfToday(),
      deliveryCharge,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "pending",
      transactionId: transactionId || "",
      customerNote: customerNote || ""
    });

    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({
      success: true,
      message: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে।",
      order
    });
  } catch (e) { next(e); }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (e) { next(e); }
}

async function getOrder(req, res, next) {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user._id };

    const order = await Order.findOne(filter).populate("customer", "name email phone");
    if (!order) return res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি।" });
    res.json({ success: true, order });
  } catch (e) { next(e); }
}

async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি।" });
    if (["ডেলিভারির পথে", "ডেলিভারড", "বাতিল"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "এই অবস্থায় অর্ডার বাতিল করা যাবে না।" });
    }

    order.orderStatus = "বাতিল";
    order.cancelledReason = req.body.reason || "গ্রাহক অর্ডার বাতিল করেছেন।";
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.json({ success: true, message: "অর্ডার বাতিল হয়েছে।", order });
  } catch (e) { next(e); }
}

module.exports = { createOrder, myOrders, getOrder, cancelOrder };
