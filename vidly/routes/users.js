const { User, validateUser } = require('../models/user');
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

// Add a new user ("Register")
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verify that user email doesn't already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    // Unique "_id" created by "new" operation, not save()
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    await user.save();
    res.send(user);
});


module.exports = router;