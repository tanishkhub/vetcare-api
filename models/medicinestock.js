const mongoose = require('mongoose');

const MedicineStockSchema = new mongoose.Schema({
  medicineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  brandName: { type: String, required: true },
  medicineName: { type: String, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
});

// Create a TTL index on the expiryDate field with a 1-second expiration time
MedicineStockSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('MedicineStock', MedicineStockSchema);
