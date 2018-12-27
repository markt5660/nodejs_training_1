const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const home = require('./routes/home');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const app = express();

// Verify that the necessary config properties are defined
console.log(`App: ${config.get('name')}`);

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

if (!config.get('mongoUrl')) {
    console.error('FATAL ERROR: mongoUrl is not defined.');
    process.exit(1);
}

// Connect to MongoDB (config controlled by env)
mongoose.connect(config.get('mongoUrl'))
    .then(() => console.log('Connected to local MongoDB...'))
    .catch(err => console.error('Could not connect to to local MongoDB...', err));

// Add request processing middleware function
// to parse request body containing JSON
app.use(express.json());

// Add resource routers
app.use('/', home);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
