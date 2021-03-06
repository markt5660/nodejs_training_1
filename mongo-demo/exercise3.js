const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.1.24/mongo-exercises')
    .then(() => console.log('connected to remote mongodb...'))
    .catch(err => console.error('could not connec to to remote mongodb...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses () {
    return await Course
        .find({ isPublished: true })
        .or([
            { price: { $gte: 15 } }, 
            { name: /.*by.*/i } 
        ])
        .sort('-price')
        .select('name author price');
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

run();