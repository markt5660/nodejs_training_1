const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { Genre, validateGenre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
** Genre routes
*/

// Get list of genres
router.get('/', async (req, res, next) => {
    try {
        const genres = await Genre.find().sort({ name: 1 });
        res.send(genres);
    }
    catch (ex) {
        next(ex);   // should be error handler middleware
    }
});

// Get a specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

// Add new genre
router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

   // Unique "_id" created by "new" operation, not save()
   const genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
});

// Update existing genre
router.put('/:id', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,
        { name: req.body.name },
        { new: true }
    );
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
});

// Delete existing genre
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});


module.exports = router;