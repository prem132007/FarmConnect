const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationOTP } = require("./emailVerificationController");

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

    // Check required fields
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

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Only allow farmer or customer registration
    if (role && !["farmer", "customer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid registration role",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with email unverified
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
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
      isEmailVerified: false,
    });

    // Send verification OTP
    await sendVerificationOTP(normalizedEmail);

    // Registration response
    return res.status(201).json({
      message: "Registration successful. Please check your email for the OTP.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Register User Error:", error);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
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
    // Check email verification
    // ==========================
    
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        emailVerificationRequired: true,
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