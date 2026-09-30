const router = require("express").Router();
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
