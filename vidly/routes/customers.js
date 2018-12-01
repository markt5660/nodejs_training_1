const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*
** VIDLY Cutomer Schema and Model (via Mongoose)
*/

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
        validate: {
            validator: function (v) {
                return v && v.length == 10 && isNumeric(v);
            },
            message: 'value must be exactly 10 digits.'
        }
    }
}));


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
router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    try {
        customer = await customer.save();
        res.send(customer);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

// Update an existing customer
router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
});


/*
** Customer support methods
*/

// Verify the given value is "numeric" (all digits)
function isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Validate incoming customer information
function validateCustomer (customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}


module.exports = router;