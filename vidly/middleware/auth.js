const jwt = require('jsonwebtoken');
const config = require('config');

// Shortcut form of function export (useful for middleware modules)
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied; no token provided.');

    try {
        const payload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = payload;
        next();
    } 
    catch (ex) {
        console.log(ex);
        return res.status(400).send('Invalid token.');
    }
}
