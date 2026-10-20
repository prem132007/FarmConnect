const Message = require("../models/Message");
const User = require("../models/User");

// =========================================
// Send Message
// =========================================
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    // Check receiver
    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver is required.",
      });
    }

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    // Find receiver
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found.",
      });
    }

    // Find sender
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found.",
      });
    }

    // Only Farmer <-> Customer messaging
    const validConversation =
      (sender.role === "customer" && receiver.role === "farmer") ||
      (sender.role === "farmer" && receiver.role === "customer");

    if (!validConversation) {
      return res.status(403).json({
        message: "Messages are allowed only between customers and farmers.",
      });
    }

    // Create message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    });

    // Return populated message
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email role")
      .populate("receiver", "name email role");

    // Send real-time message to receiver
    const io = req.app.get("io");

    io.to(receiverId.toString()).emit("newMessage", populatedMessage);

    res.status(201).json({
      message: "Message sent successfully.",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================
// Get Conversation
// =========================================
const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    // Check other user
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Get messages between both users
    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: currentUserId,
        },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    // Mark received messages as read
    const unreadMessages = await Message.find({
      sender: otherUserId,
      receiver: currentUserId,
      read: false,
    });

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    const io = req.app.get("io");

    if (unreadMessages.length > 0) {
      io.to(otherUserId.toString()).emit("messagesRead", {
        readerId: currentUserId,
        messageIds: unreadMessages.map((msg) =>
          msg._id.toString()
        ),
      });
    }

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get Conversation Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================
// Get Chat Users
// =========================================
const getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Customer can chat with farmers
    // Farmer can chat with customers
    const oppositeRole =
      currentUser.role === "customer"
        ? "farmer"
        : currentUser.role === "farmer"
        ? "customer"
        : null;

    if (!oppositeRole) {
      return res.status(200).json({
        users: [],
      });
    }

    const users = await User.find({
      role: oppositeRole,
    }).select("name email role");

    // Get unread message counts for each chat user
    const unreadMessages = await Message.find({
      receiver: currentUserId,
      sender: { $in: users.map((user) => user._id) },
      read: false,
    }).select("sender");

    const unreadCounts = {};

    unreadMessages.forEach((message) => {
      const senderId = message.sender.toString();

      unreadCounts[senderId] =
        (unreadCounts[senderId] || 0) + 1;
    });

    res.status(200).json({
      users,
      unreadCounts,
    });
  } catch (error) {
    console.error("Get Chat Users Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================================
// Export Controllers
// =========================================
module.exports = {
  sendMessage,
  getConversation,
  getChatUsers,
};