const bcrypt = require('bcrypt-nodejs');

function run1 () {
    var saltValue = '';
    bcrypt.genSalt(10, function (err, salt) {
        saltValue = salt;
        console.log(saltValue);

        var hashValue = '';
        bcrypt.hash('1234', saltValue, null, function (err, hash) {
            hashValue = hash;
            console.log(hashValue);
        });
    });
}

function run2 () {
    bcrypt.hash('1234', null, null, function (err, hash) {
        console.log(hash);
    });
}

run1();
run2();