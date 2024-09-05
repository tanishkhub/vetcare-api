const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['medicine', 'vaccine'], required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  mrp: { type: Number, required: true },
  nextAppointmentDate: { type: Date },
  ownerName: { type: String, required: true },
  patientName: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
