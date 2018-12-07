const express = require('express');
const mongoose = require('mongoose');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();

/*
// Connect to MongoDB at home
mongoose.connect('mongodb://192.168.1.24/vidly')
    .then(() => console.log('Connected to remote MongoDB...'))
    .catch(err => console.error('Could not connect to to remote MongoDB...', err));
*/
// Connect to MongoDB at work
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to local MongoDB...'))
    .catch(err => console.error('Could not connect to to local MongoDB...', err));

// Add request processing middleware function
// to parse request body containing JSON
app.use(express.json());

// Add resource routers
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
