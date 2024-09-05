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

    let message = 'The following stocks are expiring soon:\n\n';

    // Add vaccine details to the message
    if (expiringVaccines.length > 0) {
      message += 'Vaccine Stocks:\n\n';
      expiringVaccines.forEach(stock => {
        message += `Vaccine Name: ${stock.vaccineName}\nBrand: ${stock.brandName}\nExpiry Date: ${stock.expiryDate.toDateString()}\n\n`;
      });
    } else {
      message += 'No vaccines expiring soon.\n\n';
    }

    // Add medicine details to the message
    if (expiringMedicines.length > 0) {
      message += 'Medicine Stocks:\n\n';
      expiringMedicines.forEach(stock => {
        message += `Medicine Name: ${stock.medicineName}\nBrand: ${stock.brandName}\nExpiry Date: ${stock.expiryDate.toDateString()}\n\n`;
      });
    } else {
      message += 'No medicines expiring soon.\n\n';
    }

    // Send notification
    await sendExpiryNotification(message);

    res.send('Mail sent');
  } catch (error) {
    console.error('Error checking expiry dates:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = { router, authMiddleware };


module.exports = { router, authMiddleware };
