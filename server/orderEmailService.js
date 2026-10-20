const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendOrderStatusEmail(customer, order) {
  if (!customer?.email) {
    throw new Error("Customer email address is missing");
  }

  const messages = {
    Accepted: "The farmer has accepted your order.",
    "Ready for Delivery": "Your order is ready for delivery.",
    "Out for Delivery": "Your order is out for delivery.",
    Delivered: "Your order has been delivered.",
    Cancelled: "Your order has been cancelled.",
  };

  const message = messages[order.status];

  if (!message) return;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: `FarmConnect order update: ${order.status}`,
    text: `${message}\nOrder ID: ${order._id}`,
  });
}

module.exports = { sendOrderStatusEmail };