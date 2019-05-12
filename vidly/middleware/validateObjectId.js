const mongoose = require('mongoose');

const winston = require('winston');

module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid ID');
    } 
    next();
}