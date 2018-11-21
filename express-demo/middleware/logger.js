
function log (req, res, next) {
    console.log('Logging...');
    next(); // Pass request to next middleware function in the pipeline
}

module.exports = log;