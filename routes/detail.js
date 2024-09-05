const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Detail = require('../models/detail');

// Route to add details for a patient
router.post('/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const { type, name, brand, mrp, nextAppointmentDate, ownerName, patientName, species, age, sex, mobileNumber } = req.body;

  try {
    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new detail
    const newDetail = new Detail({
      patient: patientId,
      type,
      name,
      brand,
      mrp,
      nextAppointmentDate,
      ownerName,
      patientName,
      species,
      age,
      sex,
      mobileNumber
    });

    // Save the detail
    await newDetail.save();

    // Add the detail to the patient's details array
    patient.details.push(newDetail._id);
    await patient.save();

    res.status(201).json({ message: 'Detail added successfully', detail: newDetail });
  } catch (error) {
    res.status(500).json({ message: 'Error adding detail Tanishk', error });
  }
});

// Endpoint to fetch details data grouped by month
router.get('/api/dashdetails/fetch', async (req, res) => {
  try {
    // Fetch all details from the database
    const details = await Detail.find().select('dateAdded');

    if (!details || details.length === 0) {
      return res.status(404).json({ message: 'No details found' });
    }

    // Process data to return the required details
    const groupedByMonth = details.reduce((acc, detail) => {
      const dateAdded = detail.dateAdded;

      // Check if dateAdded is valid
      if (!dateAdded || isNaN(new Date(dateAdded).getTime())) {
        console.warn(`Invalid date value for detail ${detail._id}:`, dateAdded);
        return acc;
      }

      const month = new Date(dateAdded).toISOString().slice(0, 7); // Format YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Convert grouped data to an array format suitable for charting
    const data = Object.keys(groupedByMonth).map(month => ({
      month,
      count: groupedByMonth[month]
    }));

    // Return data
    res.json(data);
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
