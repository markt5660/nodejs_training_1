const { Rental, validateRental } = require('../models/rental');
const { Movie, validateMovie } = require('../models/movie');
const { Customer, validateCustomer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
** Rental routes
*/

// Get list of rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort({ dueDate: 1 });
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

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    let rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title
        },
        customer: {
            _id: customer._id,
            name: customer.name
        },
        rentalDate: Date.now(),
        dueDate: addDays(Date.now(), 14)
    });

    try {
        // overwrite original local object with one created by the DB (includes _id)
        rental = await rental.save();
        res.send(rental);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
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
  