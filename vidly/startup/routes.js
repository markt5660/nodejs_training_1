const express = require('express');

const error = require('../middleware/error');

const auth = require('../routes/auth');
const home = require('../routes/home');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');

module.exports = function (app) {

    // Add request processing middleware function
    // to parse request body containing JSON
    app.use(express.json());

    // Add global exception handler middleware function
    // (should always be the last middleware function registered)
    app.use(error);

    // Add standard route handlers
    app.use('/', home);
    app.use('/api/auth', auth);
    app.use('/api/customers', customers);
    app.use('/api/genres', genres);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);

}