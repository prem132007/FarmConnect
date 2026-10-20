const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================
// Register User
// ==========================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      country,
      role,
    } = req.body;

    // ==========================
    // Check Required Fields
    // ==========================

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // ==========================
    // Check Email
    // ==========================

    const userExists = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ==========================
    // Hash Password
    // ==========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================
    // Create User
    // ==========================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      gender,
      dateOfBirth,
      address: address.trim(),
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      country: country || "India",
      role: role || "customer",
    });

    // ==========================
    // Registration Response
    // ==========================

    res.status(201).json({
      message: "User Registered Successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Login User
// ==========================
const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ==========================
    // Validate Login Fields
    // ==========================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ==========================
    // Find User
    // ==========================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // ==========================
    // Compare Password
    // ==========================

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // ==========================
    // Generate JWT
    // ==========================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================
    // Login Response
    // ==========================

    res.status(200).json({
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get All Users - Admin
// ==========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Export Controllers
// ==========================
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};