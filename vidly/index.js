const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

/*
** VIDLY catalog (stub)
*/

const genres = [
    { id: 1, name: 'Drama' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Historical' },
    { id: 4, name: 'SciFi' },
    { id: 5, name: 'Horror' }
];


/*
** Root routes
*/

app.get('/', (req, res) => {
    res.send('Welcome to Vidly');
});


/*
** Genre routes
*/

// Get list of genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

// Get a specific genre
app.get('/api/genres/:id', (req, res) => {
    // Look up the genre. Return 404 if not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // Return the found genre
    res.send(genre);
});

// Add new genre
app.post('/api/genres', (req, res) => {
    // Validate the incoming new genre, return 400 if bad request
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create new genre and add it to the catalog
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);

    // Return new genre
    res.send(genre);
});

// Update existing genre
app.put('/api/genres/:id', (req, res) => {
    // Look up the genre. Return 404 if not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // Validate the incoming genre update, return 400 if bad request
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update and return updated genre
    genre.name = req.body.name;
    res.send(genre);
});

// Delete existing genre
app.delete('/api/genres/:id', (req, res) => {
    // Look up the genre. Return 404 if not found
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the deleted course
    res.send(genre);
});

// Genre support: validate incoming genre information
function validateGenre (genre) {
    return Joi.validate(genre, {
        name: Joi.string().min(3).required()
    });
}


// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
