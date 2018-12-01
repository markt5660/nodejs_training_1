const Joi = require('joi');
const mongoose = require('mongoose');

/*
** VIDLY Genre Schema and Model (via Mongoose)
*/

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));


/*
** Genre support methods
*/

// Validate incoming genre information
function validateGenre (genre) {
    return Joi.validate(genre, {
        name: Joi.string().min(3).required()
    });
}


exports.Genre = Genre;
exports.validate = validateGenre;