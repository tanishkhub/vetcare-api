const nodemailer = require('nodemailer');
const crypto = require('crypto'); // for generating a unique identifier

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // or another email service
  auth: {
    user: 'alert.vetcare@gmail.com', // replace with your email
    pass: 'xhofkvqwdcnzowbn' 
  }
});

const sendExpiryNotification = async (message) => {
  const timestamp = new Date().toISOString(); // to create a unique identifier based on the current time
  const mailOptions = {
    from: 'alert.vetcare@gmail.com', 
    to: 'tanishk0297@gmail.com, yooajay@gmail.com',
    subject: `Vaccine Expiry Alert - ${timestamp}`, // unique subject by adding timestamp
    messageId: `<${crypto.randomBytes(16).toString('hex')}@alert.vetcare.com>`, // unique Message-ID
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <img src="https://i.ibb.co/Km4376c/Dark-Abstract-Graphic-Designer-Email-Header.png?text=Vaccine+Expiry+Alert" alt="Vaccine Expiry Alert" style="max-width: 100%; height: auto;">
        </div>
        <div style="padding: 20px; background-color: #fff;">
          <h1 style="color: #ff6347; text-align: center;">Vaccine Expiry Alert</h1>
          <p style="font-size: 16px; line-height: 1.6; text-align: justify;">
            Dear Dr. Ajay,
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: justify;">
            ${message}
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://vetcaree.vercel.app" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Check Expiring Vaccines</a>
          </div>
          <p style="font-size: 16px; line-height: 1.6; text-align: justify;">
            Please take necessary action to avoid the shortage/wastage of vaccines.
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: justify;">
            Regards,<br/>
            The VetCare Team
          </p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="font-size: 12px; color: #666;">© 2024 VetCare. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Expiry notification sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendExpiryNotification };
