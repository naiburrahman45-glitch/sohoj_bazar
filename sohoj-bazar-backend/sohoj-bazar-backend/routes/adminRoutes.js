const router = require("express").Router();
const { dashboard, listOrders, updateOrderStatus, listCustomers } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/dashboard", dashboard);
router.get("/orders", listOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/customers", listCustomers);

module.exports = router;
