const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendOrderStatusEmail } = require("../orderEmailService");

const placeOrder = async (req, res) => {
  try {
    const {
      customerId,
      farmerId,
      productId,
      quantity,
      totalPrice,
      paymentMethod,
      paymentStatus,
      paymentId,
      deliveryAddress,
      city,
      state,
      pincode,
      estimatedDeliveryDate,
    } = req.body;

    // ==========================
    // BASIC VALIDATION
    // ==========================

    if (!customerId || !farmerId || !productId) {
      return res.status(400).json({
        message:
          "Customer, farmer and product information are required",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // ==========================
    // DELIVERY VALIDATION
    // ==========================

    if (
      !deliveryAddress ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please provide complete delivery details",
      });
    }

    // ==========================
    // FIND PRODUCT
    // ==========================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ==========================
    // CHECK STOCK
    // ==========================

    if (product.quantity < quantity) {
      return res.status(400).json({
        message: `Only ${product.quantity} units available`,
      });
    }

    // ==========================
    // CREATE ORDER
    // ==========================

    const order = await Order.create({
      customerId,
      farmerId,
      productId,
      quantity,
      totalPrice,

      paymentMethod:
        paymentMethod || "Cash on Delivery",

      paymentStatus:
        paymentStatus || "Pending",

      paymentId:
        paymentId || "",

      deliveryAddress:
        deliveryAddress.trim(),

      city:
        city.trim(),

      state:
        state.trim(),

      pincode:
        pincode.trim(),

      estimatedDeliveryDate:
        estimatedDeliveryDate || null,
    });

    // ==========================
    // REDUCE PRODUCT STOCK
    // ==========================

    product.quantity -= quantity;

    await product.save();

    // ==========================
    // RESPONSE
    // ==========================

    res.status(201).json({
      message: "Order Placed Successfully",
      order,
      remainingStock: product.quantity,
    });
  } catch (error) {
    console.error(
      "Place Order Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// GET CUSTOMER ORDERS
// ==========================

const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({
      customerId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get Customer Orders Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// GET FARMER ORDERS
// ==========================

const getFarmerOrders = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const orders = await Order.find({
      farmerId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Get Farmer Orders Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};



/* ==========================
   UPDATE ORDER STATUS
========================== */

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
      "Ready for Delivery",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Find the existing order.
    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const previousStatus = existingOrder.status;

    const updateData = {
      status,
    };

    // ==========================
    // DELIVERY STATUS
    // ==========================

    if (status === "Ready for Delivery") {
      updateData.deliveryStatus = "Ready";
    } else if (status === "Out for Delivery") {
      updateData.deliveryStatus = "Out for Delivery";
    } else if (status === "Delivered") {
      updateData.deliveryStatus = "Delivered";

      // Set delivery timestamp only on first delivery.
      if (previousStatus !== "Delivered") {
        updateData.deliveredAt = new Date();
      }
    } else if (status === "Cancelled") {
      updateData.deliveryStatus = "Not Started";
    }

    // ==========================
    // UPDATE ORDER
    // ==========================

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ==========================
    // NOTIFICATION AND EMAIL
    // ==========================

    // Run notifications only when the status changes.
    if (previousStatus !== status) {
      const notificationMessages = {
        Pending: "Your order is pending confirmation.",
        Accepted: "The farmer has accepted your order.",
        Rejected: "Your order has been rejected.",
        "Ready for Delivery":
          "Your order is ready for delivery.",
        "Out for Delivery":
          "Your order is out for delivery.",
        Delivered:
          "Your order has been delivered successfully.",
        Cancelled:
          "Your order has been cancelled.",
      };

      // Create in-app notification.
      try {
        await Notification.create({
          customerId: order.customerId,
          orderId: order._id,
          title: "Order Status Updated",
          message:
            notificationMessages[status] ||
            `Your order status changed to ${status}.`,
          status,
          isRead: false,
        });
      } catch (notificationError) {
        console.error(
          "Notification creation failed:",
          notificationError.message
        );
      }

      // Send email to the customer.
      try {
        const customer = await User.findById(
          order.customerId
        ).select("name email");

        if (customer && customer.email) {
          await sendOrderStatusEmail(customer, order);

          console.log(
            `Order status email sent successfully for order ${order._id}.`
          );
        } else {
          console.warn(
            `Customer email not found for order ${order._id}.`
          );
        }
      } catch (emailError) {
        // Email failure must not undo a successful order update.
        console.error(
          "Order status email failed:",
          emailError.message
        );
      }
    }

    // Return success even if notification or email failed.
    return res.status(200).json({
      message: "Order Status Updated Successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to update order status",
    });
  }
};


/* ==========================
   CUSTOMER DASHBOARD
========================== */

const getCustomerDashboard = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({
      customerId,
    });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const acceptedOrders = orders.filter(
      (order) => order.status === "Accepted"
    ).length;

    const rejectedOrders = orders.filter(
      (order) => order.status === "Rejected"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    return res.status(200).json({
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      deliveredOrders,
    });
  } catch (error) {
    console.error("Customer Dashboard Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


/* ==========================
   GET ALL ORDERS
========================== */

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


/* ==========================
   GET CUSTOMER ORDER TRACKING
========================== */

const getCustomerOrderTracking = async (req, res) => {
  try {
    const { customerId, orderId } = req.params;

    if (
      !mongoose.isValidObjectId(customerId) ||
      !mongoose.isValidObjectId(orderId)
    ) {
      return res.status(400).json({
        message: "Invalid customer ID or order ID",
      });
    }

    // Only retrieve an order belonging to this customer.
    const order = await Order.findOne({
      _id: orderId,
      customerId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this customer",
      });
    }

    const status = order.status;

    const isTerminal = ["Rejected", "Cancelled"].includes(status);
    const isDelivered = status === "Delivered";

    const stages = [
      {
        key: "placed",
        label: "Order Placed",
        completed: true,
        date: order.createdAt || null,
      },
      {
        key: "accepted",
        label: "Accepted by Farmer",
        completed: [
          "Accepted",
          "Ready for Delivery",
          "Out for Delivery",
          "Delivered",
        ].includes(status),
        date: null,
      },
      {
        key: "ready",
        label: "Ready for Delivery",
        completed: [
          "Ready for Delivery",
          "Out for Delivery",
          "Delivered",
        ].includes(status),
        date: null,
      },
      {
        key: "out-for-delivery",
        label: "Out for Delivery",
        completed: [
          "Out for Delivery",
          "Delivered",
        ].includes(status),
        date: null,
      },
      {
        key: "delivered",
        label: "Delivered",
        completed: isDelivered,
        date: order.deliveredAt || null,
      },
    ];

    return res.status(200).json({
      orderId: order._id,
      customerId: order.customerId,
      farmerId: order.farmerId,
      productId: order.productId,

      quantity: order.quantity,
      totalPrice: order.totalPrice,

      status: order.status,
      deliveryStatus: isDelivered
        ? "Delivered"
        : order.deliveryStatus,

      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,

      deliveryAddress: order.deliveryAddress,
      city: order.city,
      state: order.state,
      pincode: order.pincode,

      estimatedDeliveryDate: order.estimatedDeliveryDate,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,

      isTerminal,
      isDelivered,
      stages,
    });
  } catch (error) {
    console.error(
      "Get Customer Order Tracking Error:",
      error
    );

    return res.status(500).json({
      message: "Unable to retrieve order tracking",
    });
  }
};


/* ==========================
   EXPORT
========================== */

module.exports = {
  placeOrder,
  getCustomerOrders,
  getFarmerOrders,
  updateOrderStatus,
  getCustomerDashboard,
  getAllOrders,
  getCustomerOrderTracking,
};
