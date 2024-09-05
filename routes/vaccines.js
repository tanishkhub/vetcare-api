const express = require('express');
const router = express.Router();
const Vaccine = require('../models/vaccine');

// Get all vaccines
router.get('/', async (req, res) => {
  try {
    const vaccines = await Vaccine.find();
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new vaccine
router.post('/', async (req, res) => {
  const { brandName, vaccineName, mrp } = req.body;
  const vaccine = new Vaccine({ brandName, vaccineName, mrp });
  try {
    const newVaccine = await vaccine.save();
    res.status(201).json(newVaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Filter vaccines
router.get('/filter', async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const vaccines = await Vaccine.find({
      $or: [
        { vaccineName: { $regex: searchTerm, $options: 'i' } },
        { brandName: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.status(200).json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
