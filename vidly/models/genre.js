const Joi = require('joi');
const mongoose = require('mongoose');

/*
** VIDLY Genre Schema and Model (via Mongoose)
*/

const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


/*
** Genre support methods
*/

// Validate incoming genre information
function validateGenre (genre) {
    return Joi.validate(genre, {
        name: Joi.string().min(5).max(50).required()
    });
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;