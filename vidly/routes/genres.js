const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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
** Genre routes
*/

// Get list of genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

// Get a specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

// Add new genre
router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    try {
        // overwrite original local object with one created by the DB (includes _id)
        genre = await genre.save();
        res.send(genre);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
});

// Update existing genre
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});


// Genre support: validate incoming genre information
function validateGenre (genre) {
    return Joi.validate(genre, {
        name: Joi.string().min(3).required()
    });
}


module.exports = router;