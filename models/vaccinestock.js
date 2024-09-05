const mongoose = require('mongoose');

const VaccineStockSchema = new mongoose.Schema({
  vaccineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vaccine', 
    required: true 
  },
  brandName: { type: String, required: true },
  vaccineName: { type: String, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
});

// Create a TTL index on the expiryDate field
VaccineStockSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to check if quantity is 0
VaccineStockSchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.remove()
      .then(() => next(new Error('Record deleted due to zero quantity')))
      .catch(next);
  } else {
    next();
  }
});

module.exports = mongoose.model('VaccineStock', VaccineStockSchema);
