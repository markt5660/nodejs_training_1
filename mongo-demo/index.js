const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.1.24/playground')
    .then(() => console.log('connected to remote mongodb...'))
    .catch(err => console.error('could not connec to to remote mongodb...', err));

// Schemas are specific to Mongoose to provide additional
// support for MongoDB

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web','mobile','network'],
        lowercase: true,
        // uppercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            // Custom asynchronous validator
            isAsync: true,
            validator: function (v, callback) {
                // use timeout to simulate 1 sec "read" from external source
                // (DB, file system, network, etc.)
                setTimeout(() => {
                    // Normally, this would use the results of the "read"
                    // as part of the validation checks to get the result.
                    const result = v && v.length > 0;
                    callback(result);
                }, 1000);
            },
            message: 'Course requres at least one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            // Price is only required on "published" courses
            // (cannot use function [arrow] notation because we need to reference "this")
            return this.isPublished;
        },
        min: 10,
        max: 200,
        get: v => Math.round(v),  // invoked when you "get" the property of the object, not when you read from the DB
        set: v => Math.round(v)   // invoked when you "set" the property of the object, not when you write to the DB
    }
});

// Once a schema has been defined, it can be compiled
// into a Model (class) from which Instanes (objects) can be created

const Course = mongoose.model('Course', courseSchema);

async function createCourse () {
    // Create a new course (object) from the Mongoose model (class)
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        //tags: ['angular', 'frontend'],
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });

    // Save new objects to the MongoDB via Mongoose asynchronously
    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}

async function getCourses () {
    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
        //.find({ author:'Mosh', isPublished: true })
        .find({ _id: '5c02dd831894e036e0e01ad7' })
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1, price: 1 });
    console.log(courses[0].price);
}

// Query first approach
/*
async function updateCourse (id) {
    const course = await Course.findById(id);
    if (!course) {
        console.log('id not found', id);
        return;
    }

    course.isPublished = true;
    course.author = 'Another Author';

    const result = await course.save();
    console.log(result);
}
*/

// Update first approach
async function updateCourse (id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, { new: true });
    console.log(course);
}

async function removeCourse (id) {
//    const result = await Course.deleteOne({ _id: id });
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
}


//createCourse();
getCourses();
//updateCourse('5bf9eb5a783a5522ecbdee27');
//removeCourse('5bf9eb5a783a5522ecbdee27');
