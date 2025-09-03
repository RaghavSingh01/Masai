const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;


const SENDER_EMAIL = 'web.dev1013@gmail.com'; 
const SENDER_PASSWORD = 'nkre sceu oybu ecpu'; 


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

app.get('/sendemail', async (req, res) => {
  const mailOptions = {
    from: SENDER_EMAIL,
    to: [SENDER_EMAIL, 'web.dev1013@gmail.com'], 
    subject: 'NEM Student Test Email',
    text: 'This is a testing Mail sent by NEM student, no need to reply.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email. Check server logs for details.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Access http://localhost:${port}/sendemail to send the test email.`);
});