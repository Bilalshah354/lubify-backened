const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// require('./utils/cron');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const reviewRoutes = require('./routes/review');
const vehicleRoutes = require('./routes/vehicle');
const oilChangeRoutes = require('./routes/oilChange');
const sourceItRoutes = require('./routes/sourceIt');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection failed:', err?.message || err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`)
  );

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.error(`Port ${PORT} is already in use. Stop the other process and try again.`);
      process.exit(1);
    }
    // eslint-disable-next-line no-console
    console.error('Server error:', err);
    process.exit(1);
  });
}

// Routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'CORS is working!', 
    timestamp: new Date().toISOString(),
    headers: req.headers,
    method: req.method,
    url: req.url
  });
});

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/oilChanges', oilChangeRoutes);
app.use('/api/source-it', sourceItRoutes);

start();
