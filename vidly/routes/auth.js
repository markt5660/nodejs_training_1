const { User } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
** User routes
*/

// Get list of users
router.get('/', async (req, res) => {
    const users = await User.find().sort({ email: 1 });
    res.send(users);
});

// Get a specific user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found');
    res.send(user);
});

// Authenticate an existing user by "creating" a new "login"
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verify that user email doesn't already exist
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    // Authenticate the password against the hash
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (!result) {
            return res.status(400).send('Invalid email or password.');
        } else {
            const token = user.generateAuthToken();
            res.send(token);
        }
    });
});

function validate (req) {
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;