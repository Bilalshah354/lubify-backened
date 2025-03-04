
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const reviewRoutes = require('./routes/review');
const vehicleRoutes = require('./routes/vehicle');
const oilChangeRoutes = require('./routes/oilChange');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/oilChanges', oilChangeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
