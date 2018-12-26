const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());
console.log(`Generated ID valid: ${mongoose.Types.ObjectId.isValid(id)}`);

const myId = '1234';
console.log(`Supplied ID valid: ${mongoose.Types.ObjectId.isValid(myId)}`);
