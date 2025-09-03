const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // The createTransporter method below needs to be fixed.
    this.transporter = this.createTransporter(); 
  }

  createTransporter() {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      // FIX: Changed createTransporter to createTransport
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
          pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
        }
      });
    }

    const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';

    switch (emailProvider.toLowerCase()) {
      case 'gmail':
        // FIX: Changed createTransporter to createTransport
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

      case 'outlook':
        // FIX: Changed createTransporter to createTransport
        return nodemailer.createTransport({
          service: 'hotmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

      case 'sendgrid':
        // FIX: Changed createTransporter to createTransport
        return nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
          }
        });

      case 'smtp':
        // FIX: Changed createTransporter to createTransport
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

      default:
        throw new Error(`Unsupported email provider: ${emailProvider}`);
    }
  }

  async sendEmail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);

      if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
      }

      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email, name) {
    const subject = 'Welcome to Our Platform!';
    const text = `
Hello ${name},
Welcome to our platform! We're excited to have you on board.
If you have any questions, feel free to contact our support team.
Best regards,
The Team
    `;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our Platform!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Welcome to our platform! We're excited to have you on board.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendPasswordResetEmail(email, name, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `
Hello ${name},
You are receiving this email because you (or someone else) have requested a password reset for your account.
Please click on the following link, or paste this into your browser to complete the process within 30 minutes of receiving it:
${resetUrl}
If you did not request this, please ignore this email and your password will remain unchanged.
Best regards,
The Team
    `;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
        <p>Please click on the following button to reset your password within 30 minutes:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendPasswordResetConfirmation(email, name) {
    const subject = 'Password Reset Successful';
    const text = `
Hello ${name},
Your password has been successfully reset.
If you did not make this change, please contact our support team immediately.
Best regards,
The Team
    `;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Successful</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `;
    return await this.sendEmail(email, subject, text, html);
  }

  async sendEmailVerification(email, name, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    const subject = 'Please Verify Your Email Address';
    const text = `
Hello ${name},
Please verify your email address by clicking the link below:
${verifyUrl}
This link will expire in 24 hours.
Best regards,
The Team
    `;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Please Verify Your Email Address</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `;
    return await this.sendEmail(email, subject, text, html);
  }
}

module.exports = new EmailService();