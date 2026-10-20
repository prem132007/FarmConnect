const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getCustomerOrders,
  getFarmerOrders,
  updateOrderStatus,
  getCustomerDashboard,
  getAllOrders,
  getCustomerOrderTracking,
} = require("../controllers/orderController");

// ==========================
// Place Order
// ==========================
router.post("/", placeOrder);

// ==========================
// Get Customer Orders
// ==========================
router.get(
  "/customer/:customerId",
  getCustomerOrders
);

// ==========================
// Get Customer Order Tracking
// ==========================
router.get(
  "/customer/:customerId/:orderId/tracking",
  getCustomerOrderTracking
);

// ==========================
// Customer Dashboard Statistics
// ==========================
router.get(
  "/customer-dashboard/:customerId",
  getCustomerDashboard
);

// ==========================
// Get Farmer Orders
// ==========================
router.get(
  "/farmer/:farmerId",
  getFarmerOrders
);

// ==========================
// Get All Orders - Admin
// ==========================
router.get(
  "/admin",
  getAllOrders
);

// ==========================
// Update Order Status
// ==========================
router.put(
  "/:id/status",
  updateOrderStatus
);

module.exports = router;