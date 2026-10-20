const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addProduct,
  getMyProducts,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// Add Product Route
router.post("/add", upload.single("image"), addProduct);

// Get All Products
router.get("/", getAllProducts);

// Get My Products
router.get("/my-products/:farmerId", getMyProducts);

// Delete Product
router.delete("/:id", deleteProduct);

// Update Product
router.put("/:id", updateProduct);

module.exports = router;