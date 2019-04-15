const Joi = require('joi');
const moment = require('moment');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental} = require('../models/rental');
const { Movie } = require('../models/movie');
const express = require('express');
const router = express.Router();


/*
** Return routes
*/

// Update rental by "posting" a new return
router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    // Fetch rental
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });

    // Validate the rental
    if (!rental) return res.status(404).send('Rental not found for customer/movie');
    if (rental.dateReturned) return res.status(400).send('Rental already processed');

    // Update the return date
    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    // Increment the movie stock (don't need a local copy)
    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);

});


// Validate incoming return information
function validateReturn (request) {
    return Joi.validate(request, {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
}


module.exports = router;