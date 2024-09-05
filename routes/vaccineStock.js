const express = require('express');
const router = express.Router();
const VaccineStock = require('../models/vaccinestock');

// Add new vaccine stock
router.post('/', async (req, res) => {
  const { vaccineId, quantity, expiryDate, brandName, vaccineName, mrp } = req.body;
  const vaccineStock = new VaccineStock({ vaccineId, quantity, expiryDate, brandName, vaccineName, mrp });
  try {
    const newStock = await vaccineStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all vaccine stock records or filter by vaccineId
router.get('/', async (req, res) => {
  try {
    const { vaccineId } = req.query;
    const filter = vaccineId ? { vaccineId } : {};
    const stocks = await VaccineStock.find(filter).populate('vaccineId');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter vaccine stock records
router.get('/filter', async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const stocks = await VaccineStock.find({
      $or: [
        { vaccineName: { $regex: searchTerm, $options: 'i' } },
        { brandName: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching vaccine stock:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update vaccine stock by ID with partial fields
router.put('/put/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find the stock record by ID and update only the provided fields
    const updatedStock = await VaccineStock.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: 'Vaccine stock not found' });
    }

    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete vaccine stock by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to delete the vaccine stock by ID
    await VaccineStock.findByIdAndDelete(id);

    // Send a success response
    res.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error deleting vaccine', error });
  }
});


module.exports = router;
