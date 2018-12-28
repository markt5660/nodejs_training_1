
// Global error handling and logging
module.exports = function (ex, req, res, next) {
    // log the exception...
    res.status(500).send('Something failed on the server.');
}
