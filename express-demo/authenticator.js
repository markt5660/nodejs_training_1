
function authenticate (req, res, next) {
    console.log('Authenticating...');
    next(); // Pass request to next middleware function in the pipeline
}

module.exports = authenticate;