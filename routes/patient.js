// routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Detail = require('../models/detail'); 

// Create a new patient
router.post('/add', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a patient by ID
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a patient by ID
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/get-details/:id', async (req, res) => {
  try {
    // Fetch the patient by ID
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });

    // Fetch all details corresponding to the IDs in the `details` array
    const details = await Detail.find({ _id: { $in: patient.details } });  // Assuming 'details' is the array field

    // Return the patient data along with the fetched details
    res.json({
      patient: patient,
      details: details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});


// GET route to fetch the latest 5 patients
// GET route to fetch the latest 5 patients
router.get('/dashpatients/fetch', async (req, res) => {
  try {
    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
