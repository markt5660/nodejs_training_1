const Joi = require('joi');
const mongoose = require('mongoose');

/*
** VIDLY Cutomer Schema and Model (via Mongoose)
*/

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return v && v.length == 10 && isNumeric(v);
            },
            message: 'value must be exactly 10 digits.'
        }
    }
}));


/*
** Customer support methods
*/

// Verify the given value is "numeric" (all digits)
function isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Validate incoming customer information
function validateCustomer (customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;