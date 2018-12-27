const Joi = require('joi');
const mongoose = require('mongoose');

/*
** VIDLY User Schema and Model (via Mongoose)
*/

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        validate: {
            validator: function (v) {
                var regex = /^\w+\@[.\w]+$/;
                return regex.test(v);
            },
            message: 'not a valid email address.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

const User = mongoose.model('User', userSchema);


/*
** User support methods
*/

// Validate incoming user information
function validateUser (user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}


exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;