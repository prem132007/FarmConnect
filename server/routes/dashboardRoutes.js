const express = require("express");

const router = express.Router();

// ======================================================
// DASHBOARD CONTROLLERS
// ======================================================

const {
  getFarmerDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

// ======================================================
// USER CONTROLLER
// ======================================================

const {
  getAllUsers,
} = require("../controllers/userController");


// ======================================================
// FARMER DASHBOARD
// GET /api/dashboard/farmer/:farmerId
// ======================================================

router.get(
  "/farmer/:farmerId",
  getFarmerDashboard
);


// ======================================================
// ADMIN DASHBOARD
// GET /api/dashboard/admin
// ======================================================

router.get(
  "/admin",
  getAdminDashboard
);


// ======================================================
// ADMIN - GET ALL USERS
// GET /api/dashboard/admin/users
// ======================================================

router.get(
  "/admin/users",
  getAllUsers
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;