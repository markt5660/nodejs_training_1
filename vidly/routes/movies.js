const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
** Movie routes
*/

// Get list of movies
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});

// Get a specific movie
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found');
    res.send(movie);
});

// Add new movie
router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            // These properties may only be a subset of the
            // total set of genre properties; only what we need here.
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        // overwrite original local object with one created by the DB (includes _id)
        movie = await movie.save();
        res.send(movie);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
});

// Update existing genre
router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true }
    );
    if (!movie) return res.status(404).send('The movie with the given ID was not found');

    res.send(movie);
});

// Delete existing genre
router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found');
    res.send(movie);
});


module.exports = router;