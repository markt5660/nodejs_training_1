const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'courseA' },
    { id: 2, name: 'courseB' },
    { id: 3, name: 'courseC' },
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
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

app.get('/api/courses/:id', (req, res) => {
    // Look up the course. Return 404 if not found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Return found course
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
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

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course. Return 404 if not found.
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the deleted course
    res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});



function validateCourse (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}