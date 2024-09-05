const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  patientName: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  details: [{ type: Schema.Types.ObjectId, ref: 'Detail' }],
}, { timestamps: true }); // Add this option to include createdAt and updatedAt fields

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
