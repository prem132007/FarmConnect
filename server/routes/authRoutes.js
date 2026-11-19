const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

const {
  verifyEmailOTP,
} = require("../controllers/emailVerificationController");

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);
router.post("/verify-email", verifyEmailOTP);


module.exports = router;