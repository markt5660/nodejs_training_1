const Joi = require('joi');
const express = require('express');
const router = express.Router();


const courses = [
    { id: 1, name: 'courseA' },
    { id: 2, name: 'courseB' },
    { id: 3, name: 'courseC' },
];


router.get('/', (req, res) => {
    res.send(courses);
});

router.post('/', (req, res) => {
    // Validate the incoming new course, return 400 if bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    // Create new course and add it to the course catalog
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);

    // Return new course
    res.send(course);
});

router.get('/:id', (req, res) => {
    // Look up the course. Return 404 if not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Return found course
    res.send(course);
});

router.put('/:id', (req, res) => {
    // Look up the course. Return 404 if not found.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Validate the incoming update, return 400 if bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);

    // Update and return updated course
    course.name = req.body.name;
    res.send(course);
});

router.delete('/:id', (req, res) => {
    // Look up the course. Return 404 if not found.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the deleted course
    res.send(course);
});


function validateCourse (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


module.exports = router;