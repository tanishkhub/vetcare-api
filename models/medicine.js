const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  medicineName: { type: String, required: true },
  mrp: { type: Number, required: true }
  
});

module.exports = mongoose.model('Medicine', MedicineSchema);
