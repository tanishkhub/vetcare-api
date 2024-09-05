const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { sendExpiryNotification } = require('./mailer');
const VaccineStock = require('../models/vaccinestock');
const MedicineStock = require('../models/medicinestock');
const router = express.Router();

// Secret key for JWT (should be stored securely in an environment variable)
const JWT_SECRET = 'hakunamatata';

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// New route to fetch the username
router.get('/get-username', authMiddleware, async (req, res) => {
  try {
    // Find the user by ID (req.user contains userId from authMiddleware)
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/scheduler', async (req, res) => {
  console.log('Running expiry check...');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 60); // Check for expiry within the next 60 days

  try {
    // Fetch expiring vaccine stocks
    const expiringVaccines = await VaccineStock.find({
      expiryDate: { $gte: today, $lte: nextWeek }
    });

    // Fetch expiring medicine stocks
    const expiringMedicines = await MedicineStock.find({
      expiryDate: { $gte: today, $lte: nextWeek }
    });

    // Initialize message as HTML for better formatting
    let message = `
      <h2 style="color: #ff6347; text-align: center;">Expiring Stocks Alert</h2>
      <p>The following stocks are expiring within the next 60 days:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Stock Type</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Brand</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Add vaccine details to the message if any exist
    if (expiringVaccines.length > 0) {
      expiringVaccines.forEach(stock => {
        message += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Vaccine</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.vaccineName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.brandName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.expiryDate.toDateString()}</td>
          </tr>
        `;
      });
    } else {
      message += `<tr><td colspan="4" style="padding: 8px;">No vaccines expiring soon.</td></tr>`;
    }

    // Add medicine details to the message if any exist
    if (expiringMedicines.length > 0) {
      expiringMedicines.forEach(stock => {
        message += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Medicine</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.medicineName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.brandName}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${stock.expiryDate.toDateString()}</td>
          </tr>
        `;
      });
    } else {
      message += `<tr><td colspan="4" style="padding: 8px;">No medicines expiring soon.</td></tr>`;
    }

    // Close the table and add a footer to the message
    message += `
        </tbody>
      </table>
      <p>Please take the necessary action to avoid wastage of these stocks.</p>
      <p>Regards,<br/>The VetCare Team</p>
    `;

    // Send notification
    await sendExpiryNotification(message); // Assumes sendExpiryNotification supports HTML

    res.send('Expiry notification sent successfully.');
  } catch (error) {
    console.error('Error checking expiry dates:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

module.exports = { router, authMiddleware };


module.exports = { router, authMiddleware };
