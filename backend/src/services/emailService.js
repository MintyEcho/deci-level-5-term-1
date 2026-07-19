const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendWelcomeEmail(to, name) {
  if (!process.env.SMTP_HOST) {
    console.log(`(email disabled) Would send welcome email to ${to}`);
    return;
  }
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "no-reply@shop.com",
      to,
      subject: "Welcome to the Shop!",
      text: `Hi ${name || "there"}, thanks for creating an account with us!`,
    });
  } catch (err) {
    // Email failure should never block registration
    console.error("Failed to send welcome email:", err.message);
  }
}

module.exports = { sendWelcomeEmail };
