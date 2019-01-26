const config = require('config');       // environment configuration
const winston = require('winston');     // logging
const express = require('express');
const app = express();

require('./startup/logging')();         // Add logging
require('./startup/config')();          // Add configuration
require('./startup/database')();        // Add database
require('./startup/routes')(app);       // Add route handlers
require('./startup/validation')();      // Joi validation

// Verify that the necessary config properties are defined
winston.info(`App: ${config.get('name')}`);
winston.info(`DB : ${config.get('mongoUrl')}`);

// (TEMPORARY) Generate promise rejection to test handler
/*
const p = Promise.reject(new Error('Something failed miserably2'));
p.then(() => console.log('Done'));
*/

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
});
