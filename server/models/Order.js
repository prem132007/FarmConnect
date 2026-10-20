const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ==========================
    // CUSTOMER
    // ==========================
    customerId: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // FARMER
    // ==========================
    farmerId: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // PRODUCT
    // ==========================
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // ORDER QUANTITY
    // ==========================
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // ==========================
    // TOTAL PRICE
    // ==========================
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================
    // ORDER STATUS
    // ==========================
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Ready for Delivery",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // ==========================
    // PAYMENT
    // ==========================
    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Online",
      ],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // DELIVERY INFORMATION
    // ==========================
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // DELIVERY STATUS
    // ==========================
    deliveryStatus: {
      type: String,
      enum: [
        "Not Started",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Not Started",
    },

    // ==========================
    // DELIVERY DATE
    // ==========================
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);