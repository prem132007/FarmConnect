const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getChatUsers,
} = require("../controllers/messageController");

// =========================================
// Get Users Available for Chat
// =========================================
router.get("/users", protect, getChatUsers);

// =========================================
// Get Conversation
// =========================================
router.get("/:userId", protect, getConversation);

// =========================================
// Send Message
// =========================================
router.post("/", protect, sendMessage);

module.exports = router;