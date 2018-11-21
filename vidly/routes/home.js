const Joi = require('joi');
const express = require('express');
const router = express.Router();

/*
** Root routes
*/

router.get('/', (req, res) => {
    res.send('Welcome to Vidly');
});


module.exports = router;