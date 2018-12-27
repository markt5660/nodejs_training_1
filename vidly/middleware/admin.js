const jwt = require('jsonwebtoken');
const config = require('config');

// Shortcut form of function export (useful for middleware modules)
// Assumes this middleware function executes after the "auth" middleware
// in the request processing pipeline; no need to check/validate token
module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
    next();
}
