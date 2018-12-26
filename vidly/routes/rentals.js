const { Rental, validateRental } = require('../models/rental');
const { Movie, validateMovie } = require('../models/movie');
const { Customer, validateCustomer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

/*
** Module initialization
*/
Fawn.init(mongoose);

/*
** Rental routes
*/

// Get list of rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// Get a specific rental
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found');
    res.send(rental);
});

// Add new rental
router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');
    if (movie.numberInStock === 0) return res.status(400).send('Movie out of stock');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        // Update both rentals (new rental) and movies (decrement numberInStock)
        // as a single transaction
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        // Return new rental for display
        res.send(rental);
    } catch (ex) {
        // If any error occured in the transaction, both
        // changes to rentals and movies are rolled back.
        res.status(500).send(`Failure creating rental, ${ex}`);
    }
});

/*
** Support methods
*/

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  module.exports = router;