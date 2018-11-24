const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.1.24/playground')
    .then(() => console.log('connected to remote mongodb...'))
    .catch(err => console.error('could not connec to to remote mongodb...', err));

// Schemas are specific to Mongoose to provide additional
// support for MongoDB

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// Once a schema has been defined, it can be compiled
// into a Model (class) from which Instanes (objects) can be created

const Course = mongoose.model('Course', courseSchema);

getCourses();

async function createCourse () {
    // Create a new course (object) from the Mongoose model (class)
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });

    // Save new objects to the MongoDB via Mongoose asynchronously
    const result = await course.save();
    console.log(result);
}

async function getCourses () {
    // Regular expressions will match more than the simple 'author'
    // match defined below (which is an exact match)
    const courses = await Course
        // .find({ author:'Mosh', isPublished: true })
        // Starts with 'Mosh' (case-insensitive)
        .find({ author: /^Mosh/i })

        // Ends with 'Hamidani' (case-insensitive)
        .find({ author: /Hamidani$/i })

        // Contains 'Mosh' (zero or more characters before and zero or more after)
        .find({ author: /.*Mosh.*/ })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1});
    console.log(courses);
}