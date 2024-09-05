const cron = require('node-cron');
const mongoose = require('mongoose');
const VaccineStock = require('./models/vaccinestock'); // Update the path as necessary
const { sendExpiryNotification } = require('./mailer');

// Configure cron job to run daily
cron.schedule('0 0 * * *', async () => {
  console.log('Running expiry check...');

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7); // Check for expiry within the next 7 days

  try {
    const expiringStocks = await VaccineStock.find({
      expiryDate: { $gte: today, $lte: nextWeek }
    });

    if (expiringStocks.length > 0) {
      let message = 'The following vaccine stocks are expiring soon:\n\n';
      expiringStocks.forEach(stock => {
        message += `Vaccine Name: ${stock.vaccineName}\nBrand: ${stock.brandName}\nExpiry Date: ${stock.expiryDate.toDateString()}\n\n`;
      });

      await sendExpiryNotification(message);
    } else {
      console.log('No vaccines expiring soon.');
    }
  } catch (error) {
    console.error('Error checking expiry dates:', error);
  }
});
