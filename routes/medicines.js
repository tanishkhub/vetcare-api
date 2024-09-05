const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');
const MedicineStock = require('../models/medicinestock');

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new medicine
router.post('/', async (req, res) => {
  const { brandName, medicineName, mrp } = req.body;
  const medicine = new Medicine({ brandName, medicineName, mrp });
  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Filter medicines based on search term
router.get('/filter', async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const medicines = await Medicine.find({
      $or: [
        { medicineName: { $regex: searchTerm, $options: 'i' } },
        { brandName: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('stock');
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;