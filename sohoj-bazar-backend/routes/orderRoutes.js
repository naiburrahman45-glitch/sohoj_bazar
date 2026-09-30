const router = require("express").Router();
const { createOrder, myOrders, getOrder, cancelOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", createOrder);
router.get("/my", myOrders);
router.get("/:id", getOrder);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;
