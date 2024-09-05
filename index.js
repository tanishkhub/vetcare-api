const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { router: authRouter, authMiddleware } = require('./routes/auth');

const Medicine = require('./models/medicine');
const patientRoutes = require('./routes/patient');
const medicineRoutes = require('./routes/medicines');
const medicineStockRoutes = require('./routes/medicinestock');
const vaccinesstocks = require('./routes/vaccineStock');
const vaccines = require('./routes/vaccines');
const notificationRoutes = require('./routes/notification');


const Patient = require('./models/patient'); 
const Detail = require('./models/detail');

// Routers
const detailsRouter = require('./routes/detail');

const app = express();
const port = 5000; // or your chosen port


app.use(cors());
// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Authentication route
app.use('/api/auth', authRouter);

// Protected route: Fetch medicines
app.use('/api/medicines', medicineRoutes);
app.use('/api/medicine-stock', medicineStockRoutes);

app.use('/api/vaccines', vaccines);
app.use('/api/vaccine-stock', vaccinesstocks);
// filter api
app.get('/api/patients', async (req, res) => {
  try {
    const filters = {};
    const { ownerName, patientName, species, mobileNumber, sex, age } = req.query;

    if (ownerName) filters.ownerName = new RegExp(ownerName, 'i');
    if (patientName) filters.patientName = new RegExp(patientName, 'i');
    if (species) filters.species = new RegExp(species, 'i');
    if (mobileNumber) filters.mobileNumber = mobileNumber;
    if (sex) filters.sex = sex;
    if (age) filters.age = age;

    const patients = await Patient.find(filters);
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/', async (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
          }
          .message {
            font-size: 1.5em;
            margin-bottom: 20px;
          }
          .link {
            font-size: 1.2em;
            color: #007bff;
            text-decoration: none;
          }
          .link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="message">
          I think you are lost. Let me get you to the right path!
        </div>
        <a href="https://vetcaree.vercel.app/" class="link">Go to VetCare</a>
      </body>
    </html>
  `);
});

// filter api

app.use('/api/patients', patientRoutes);
app.use('/api/details', detailsRouter);

app.use('/api', notificationRoutes);


app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  // Connect to MongoDB
await connectDB();
})