const Joi = require('joi');             // RESTful request validation
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
require('express-async-errors');

const mongoose = require('mongoose');   // mongoDB schemas
const config = require('config');       // environment configuration params

const winston = require('winston');     // logging
require('winston-mongodb');

const auth = require('./routes/auth');
const home = require('./routes/home');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const error = require('./middleware/error');

const app = express();

// Verify that the necessary config properties are defined
console.log(`App: ${config.get('name')}`);
console.log(`Env: ${app.get('env')}`);

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

if (!config.get('mongoUrl')) {
    console.error('FATAL ERROR: mongoUrl is not defined.');
    process.exit(1);
}

const mongoUrl = config.get('mongoUrl');


winston.add(new winston.transports.File({ filename: 'vidly.log' }));
winston.add(new winston.transports.MongoDB({ db: mongoUrl }));

// Add global error handlers
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    //process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    //process.exit(1);
});

/*** Special force failure - unhandled promise rejection */
const p = Promise.reject(new Error('Something failed miserably!'));
p.then (() => console.log('Done'));
/*** Special force failure - end */

// Connect to MongoDB (config controlled by env)
mongoose.connect(mongoUrl)
    .then(() => console.log(`Connected to local MongoDB [${mongoUrl}] ...`))
    .catch(err => console.error(`Could not connect to to local MongoDB [${mongoUrl}] ...`, err));

// Add request processing middleware function
// to parse request body containing JSON
app.use(express.json());

// Add standard resource routers
app.use('/', home);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

// Add global exception handler middleware function
// (should always be the last middleware function registered)
app.use(error);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
