const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./middleware/logger');
const home = require('./routes/home');
const courses = require('./routes/courses');
const express = require('express');
const app = express();

// Setup the view (templating) engine for the application
app.set('view engine','pug');
app.set('views', './views');    // default setting (shown here for training)

// Add request processing middleware function
// to parse request body containing JSON
app.use(express.json());

// Add request processing middleware function
// to parse URL encoded payloads
app.use(express.urlencoded({ extended: true }));

// Add request processing middleware function
// to specify the "static" page folder in express
app.use(express.static('public'));

// Add request processing middleware function
// to handle HTTP headers
app.use(helmet());

// Add resource routers
app.use('/', home);
app.use('/api/courses', courses);

// Configuration
console.log('Application name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

// Add request processing middleware function
// to log HTTP requests
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

// Add request processing middleware function
// to log the request
app.use(logger);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});