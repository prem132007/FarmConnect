const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const EmailVerification = require("../models/EmailVerification");

// Gmail email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

// Generate and send OTP
const sendVerificationOTP = async (email) => {
    try {
        // Generate a random 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // OTP expires after 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Remove any previous OTP for this email
        await EmailVerification.deleteMany({ email });

        // Save OTP in MongoDB
        await EmailVerification.create({
            email,
            otp,
            expiresAt,
            attempts: 0,
        });

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "FarmConnect Email Verification",
            html: `
        <h2>Welcome to FarmConnect!</h2>
        <p>Your email verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("OTP email sending failed:", error);
        throw new Error("Unable to send verification email");
    }
};

const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await EmailVerification.findOne({
      email: normalizedEmail,
    });

    if (!verification) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check OTP expiry
    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({ _id: verification._id });

      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    // Limit incorrect attempts
    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: verification._id });

      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    // Check entered OTP
    if (verification.otp !== String(otp).trim()) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    // Mark user email as verified
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register again.",
      });
    }

    // Remove OTP after successful verification
    await EmailVerification.deleteOne({ _id: verification._id });

    return res.status(200).json({
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      message: "Server error during email verification",
    });
  }
};

module.exports = {
  sendVerificationOTP,
  verifyEmailOTP,
};