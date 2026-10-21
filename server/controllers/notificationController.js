const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/notifications/customer/:customerId
exports.getCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!isValidId(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const notifications = await Notification.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const unreadCount = await Notification.countDocuments({
      customerId,
      isRead: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Unable to fetch notifications",
    });
  }
};

// PATCH /api/notifications/:notificationId/read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { customerId } = req.body;

    if (!isValidId(notificationId) || !isValidId(customerId)) {
      return res.status(400).json({
        message: "Invalid notification or customer ID",
      });
    }

    // Only mark a notification belonging to this customer as read.
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, customerId },
      { $set: { isRead: true } },
      { returnDocument: "after" }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      message: "Unable to update notification",
    });
  }
};