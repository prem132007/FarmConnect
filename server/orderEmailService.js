
const nodemailer = require("nodemailer");

async function sendOrderStatusEmail(customer, order) {
  if (!customer?.email) {
    throw new Error("Customer email address is missing");
  }

  const messages = {
    Accepted: "The farmer has accepted your order.",
    Rejected: "Your order has been rejected.",
    "Ready for Delivery": "Your order is ready for delivery.",
    "Out for Delivery": "Your order is out for delivery.",
    Delivered: "Your order has been delivered.",
    Cancelled: "Your order has been cancelled.",
  };

  const message = messages[order.status];

  if (!message) return;

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error("Email credentials are missing from server environment");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword.replace(/\s+/g, ""),
    },
  });

  await transporter.sendMail({
    from: emailUser,
    to: customer.email,
    subject: `FarmConnect order update: ${order.status}`,
    text: `${message}\nOrder ID: ${order._id}`,
  });
}

module.exports = { sendOrderStatusEmail };
