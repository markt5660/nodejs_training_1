const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');


/*
** VIDLY Movie Schema and Model (via Mongoose)
*/

const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);


/*
** Movie support methods
*/

// Validate incoming genre information
function validateMovie (movie) {
    return Joi.validate(movie, {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
}


exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;