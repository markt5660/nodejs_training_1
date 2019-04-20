const Joi = require('joi');
const moment = require('moment');
const mongoose = require('mongoose');


/*
** VIDLY Rental Schema and Model (via Mongoose)
*/

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
                required: true,
                minlength: 10,
                maxlength: 10
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: { 
                type: String, 
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

/* Update the rental when it is returned */
rentalSchema.methods.return = function () {
    // Set the return date
    this.dateReturned = new Date();

    // Calculate the rental fee
    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

/* Simple keyed rental lookup */
rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

const Rental = mongoose.model('Rental', rentalSchema);



/*
** Rental support methods
*/

// Validate incoming rental information
function validateRental (movie) {
    return Joi.validate(movie, {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
    });
}


exports.rentalSchema = rentalSchema;
exports.Rental = Rental;
exports.validateRental = validateRental;