const express = require('express');
const router = express.Router();
const MedicineStock = require('../models/medicinestock');

// Add new stock
router.post('/', async (req, res) => {
  const { medicineId, quantity, expiryDate, brandName, medicineName, mrp } = req.body;
  const medicineStock = new MedicineStock({ medicineId, quantity, expiryDate, brandName, medicineName, mrp });
  try {
    const newStock = await medicineStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stock records or filter by medicineId
router.get('/', async (req, res) => {
  try {
    const { medicineId } = req.query;
    const filter = medicineId ? { medicineId } : {};
    const stocks = await MedicineStock.find(filter).populate('medicineId');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter stock records
router.get('/filter', async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const medicines = await MedicineStock.find({
      $or: [
        { medicineName: { $regex: searchTerm, $options: 'i' } },
        { brandName: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update medicine stock by ID with partial fields
router.put('/put/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedStock = await MedicineStock.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: 'Medicine stock not found' });
    }

    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medicine stock by ID if quantity is 0
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to delete the medicine by ID
    await MedicineStock.findByIdAndDelete(id);

    // Send a success response
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error deleting medicine', error });
  }
});


module.exports = router;
