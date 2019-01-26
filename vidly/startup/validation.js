const Joi = require('joi');             // RESTful request validation

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
}