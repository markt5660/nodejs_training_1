const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [ authorSchema ]
}));

async function createCourse (name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses () { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor (courseId) {
  const course = await Course.findById(courseId);
  course.author.name = 'Fred Flintstone';
  course.save();
}

async function updateAuthorNameDirect (courseId, newName) {
  const course = await Course.update({ _id: courseId }, {
    $set: {
      'author.name': newName
    }
  });
  console.log(course);
}

async function dropAuthor (courseId) {
  const result = await Course.update({ _id: courseId }, {
    $unset: {
      'author': ''
    }
  });
  console.log(result);
}

async function addAuthor (courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor (courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse('Node Course', [ 
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Fred' })
// ]);
// updateAuthor('5c0b08d3b0d5cc0d20c0b0f9');
// updateAuthorNameDirect('5c0b08d3b0d5cc0d20c0b0f9', 'Barney Rubble');
// dropAuthor('5c0b08d3b0d5cc0d20c0b0f9');
// addAuthor('5c0b0e50b23ee80e809ee7dc', new Author({ name: 'Amy' }));
removeAuthor('5c0b0e50b23ee80e809ee7dc', '5c0b0e50b23ee80e809ee7db');