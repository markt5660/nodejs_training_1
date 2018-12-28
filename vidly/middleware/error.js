const winston = require('winston');

module.exports = function (ex, req, res, next) {
//  winston.log('error', ex.message);
    winston.error(ex.message, ex);
    res.status(500).send('Something failed with the server.');
}
