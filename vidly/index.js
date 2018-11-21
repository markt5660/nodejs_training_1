const Joi = require('joi');
const express = require('express');
const home = require('./routes/home');
const genres = require('./routes/genres');
const app = express();

// Add request processing middleware function
// to parse request body containing JSON
app.use(express.json());

// Add resource routers
app.use('/', home);
app.use('/api/genres', genres);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
