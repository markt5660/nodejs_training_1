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
    // MongoDB logical query operators
    // or
    // and
    const courses = await Course
        // .find({ author:'Mosh', isPublished: true })
        .find()
        .or([ { author: 'Mosh' }, { isPublished: true } ])
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1});
    console.log(courses);
}