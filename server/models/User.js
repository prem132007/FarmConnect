const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================================
    // PERSONAL INFORMATION
    // =========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =========================================
    // ADDRESS INFORMATION
    // =========================================

    address: {
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

    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },

    // =========================================
    // ACCOUNT INFORMATION
    // =========================================

    role: {
      type: String,
      enum: ["farmer", "customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);