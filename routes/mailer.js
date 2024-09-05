const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // or another email service
  auth: {
    user: 'codewithus3214@gmail.com', // replace with your email
    pass: 'xhofkvqwdcnzowbn' // replace with your email password
  }
});

const sendExpiryNotification = async (message) => {
  const mailOptions = {
    from: 'codewithus3214@gmail.com', // replace with your email
    to: 'tanishk0297@gmail.com',
    subject: 'Vaccine Expiry Alert',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Expiry notification sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendExpiryNotification };
