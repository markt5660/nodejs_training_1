const config = require('config');       // environment configuration params
const winston = require('winston');     // logging
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    // Setup global exception and promise rejection handlers
/*
    process.on('uncaughtException', (ex) => {
        console.log('UNCAUGHT EXCEPTION');
        winston.error(ex.message, ex);
        process.exit(1); // terminates but no logs generated
    });

    process.on('unhandledRejection', (ex) => {
        console.log('UNHANDLED REJECTION');
        winston.error(ex.message, ex);
        process.exit(1); // terminates but no logs generated
    });
*/
    /*
    ** Doesn't seem to work with this version of Winston
    ** Handlers catch exceptions and promise rejections
    ** Process terminates but no logs generated (except console)
    */
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'vidly.log' }),
        new winston.transports.Console({ colorize:true, prettyPrint:true })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Setup logging

    winston.add(new winston.transports.File({ filename: 'vidly.log' }));
    winston.add(new winston.transports.MongoDB({ 
        db: config.get('mongoUrl'),
        level: 'info'
     }));

}