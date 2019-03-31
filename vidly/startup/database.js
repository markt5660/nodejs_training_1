const mongoose = require('mongoose');   // mongoDB schemas
const winston = require('winston');     // logging
const config = require('config');       // environment configuration params

module.exports = function () {

    // Connect to MongoDB (config controlled by env)
    //
    // Connection failure will result in rejected promise
    // propogating up to the global handler which will
    // log the failure and terminate the process
    const mongoUrl = config.get('mongoUrl');
    mongoose.connect(mongoUrl)
        .then(() => winston.info(`Connected to ${mongoUrl}...`));

}