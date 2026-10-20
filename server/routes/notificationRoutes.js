const express = require("express");
const router = express.Router();

const {
  getCustomerNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

router.get(
  "/customer/:customerId",
  getCustomerNotifications
);

router.patch(
  "/:notificationId/read",
  markNotificationAsRead
);

module.exports = router;