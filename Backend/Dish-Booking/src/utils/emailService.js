const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `Dish Booking System <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  await transporter.sendMail(message);
};

const sendPasswordResetEmail = async (user, resetURL) => {
  const message = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.name},</p>
    <p>You have requested a password reset for your account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>This link will expire in 10 minutes.</p>
    <br>
    <p>Best regards,</p>
    <p>Dish Booking System Team</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - Dish Booking System',
    message: `Please click the following link to reset your password: ${resetURL}`,
    html: message
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail
};