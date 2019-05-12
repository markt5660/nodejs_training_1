const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Customer, validateCustomer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*
** Customer routes
*/

// Get list of customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

// Get a specific customer
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
});

// Add a new customer
router.post('/', [auth, validate(validateCustomer)], async (req, res) => {
   // Unique "_id" created by "new" operation, not save()
   const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
});

// Update an existing customer
router.put('/:id', [auth, validate(validateCustomer)], async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        },
        { new: true }
    );
    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);
});

// Delete an existing customer
router.delete('/:id', [auth], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
});


module.exports = router;