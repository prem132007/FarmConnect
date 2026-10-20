const mongoose = require("mongoose");

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// ======================================================
// FARMER DASHBOARD
// GET /api/dashboard/farmer/:farmerId
// ======================================================

const getFarmerDashboard = async (req, res) => {
  try {
    const { farmerId } = req.params;

    // ------------------------------------------
    // Check Farmer ID
    // ------------------------------------------

    if (!farmerId) {
      return res.status(400).json({
        message: "Farmer ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({
        message: "Invalid farmer ID",
      });
    }

    // ------------------------------------------
    // Check Farmer Exists
    // ------------------------------------------

    const farmer = await User.findById(farmerId).select("name role");

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found",
      });
    }

    if (farmer.role !== "farmer") {
      return res.status(403).json({
        message: "This user is not a farmer",
      });
    }

    // ------------------------------------------
    // Get Dashboard Statistics
    // ------------------------------------------

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      deliveredOrders,
    ] = await Promise.all([
      Product.countDocuments({
        farmerId: farmerId,
      }),

      Order.countDocuments({
        farmerId: farmerId,
      }),

      Order.countDocuments({
        farmerId: farmerId,
        status: "Pending",
      }),

      Order.countDocuments({
        farmerId: farmerId,
        status: "Accepted",
      }),

      Order.countDocuments({
        farmerId: farmerId,
        status: "Rejected",
      }),

      Order.countDocuments({
        farmerId: farmerId,
        status: "Delivered",
      }),
    ]);

    // ------------------------------------------
    // Send Response
    // ------------------------------------------

    res.status(200).json({
      success: true,

      totalProducts,
      totalOrders,

      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      deliveredOrders,
    });

  } catch (error) {
    console.error(
      "Farmer Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load farmer dashboard",
      error: error.message,
    });
  }
};


// ======================================================
// ADMIN DASHBOARD
// GET /api/dashboard/admin
// ======================================================

const getAdminDashboard = async (req, res) => {
  try {

    // ------------------------------------------
    // Users
    // ------------------------------------------

    const [
      totalUsers,
      totalFarmers,
      totalCustomers,
      totalAdmins,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "farmer",
      }),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "admin",
      }),
    ]);


    // ------------------------------------------
    // Products
    // ------------------------------------------

    const totalProducts =
      await Product.countDocuments();


    // ------------------------------------------
    // Orders
    // ------------------------------------------

    const [
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      deliveredOrders,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.countDocuments({
        status: "Pending",
      }),

      Order.countDocuments({
        status: "Accepted",
      }),

      Order.countDocuments({
        status: "Rejected",
      }),

      Order.countDocuments({
        status: "Delivered",
      }),
    ]);


    // ------------------------------------------
    // Response
    // ------------------------------------------

    res.status(200).json({
      success: true,

      // Users
      totalUsers,
      totalFarmers,
      totalCustomers,
      totalAdmins,

      // Products
      totalProducts,

      // Orders
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      deliveredOrders,
    });

  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getFarmerDashboard,
  getAdminDashboard,
};