const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

async function dashboard(req, res, next) {
  try {
    const [customers, products, orders, delivered, pending] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "ডেলিভারড" }),
      Order.countDocuments({ orderStatus: { $nin: ["ডেলিভারড", "বাতিল"] } })
    ]);

    const sales = await Order.aggregate([
      { $match: { orderStatus: "ডেলিভারড" } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const lowStock = await Product.find({ stock: { $lte: 5 } }).select("name stock").limit(20);

    res.json({
      success: true,
      dashboard: {
        totalCustomers: customers,
        totalProducts: products,
        totalOrders: orders,
        deliveredOrders: delivered,
        pendingOrders: pending,
        deliveredSales: sales[0]?.total || 0,
        lowStock
      }
    });
  } catch (e) { next(e); }
}

async function listOrders(req, res, next) {
  try {
    const { status, search } = req.query;
    const filter = status ? { orderStatus: status } : {};
    let orders = await Order.find(filter)
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customer?.name?.toLowerCase().includes(s) ||
        o.customer?.phone?.includes(search)
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (e) { next(e); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const allowed = ["নতুন", "নিশ্চিত", "প্রস্তুত হচ্ছে", "কাটা হচ্ছে", "প্যাক করা হয়েছে", "ডেলিভারির পথে", "ডেলিভারড", "বাতিল"];
    if (!allowed.includes(req.body.orderStatus)) {
      return res.status(400).json({ success: false, message: "অর্ডারের স্ট্যাটাস সঠিক নয়।" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "অর্ডার পাওয়া যায়নি।" });

    order.orderStatus = req.body.orderStatus;
    if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
    if (req.body.transactionId !== undefined) order.transactionId = req.body.transactionId;
    await order.save();

    res.json({ success: true, message: "অর্ডারের স্ট্যাটাস আপডেট হয়েছে।", order });
  } catch (e) { next(e); }
}

async function listCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, customers });
  } catch (e) { next(e); }
}

module.exports = { dashboard, listOrders, updateOrderStatus, listCustomers };
