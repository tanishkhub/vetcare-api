const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  vaccineName: { type: String, required: true },
  brandName: { type: String, required: true },
  mrp: { type: Number, required: true }
  
});

module.exports = mongoose.model('Vaccine', vaccineSchema);
