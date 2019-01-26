const config = require('config');       // environment configuration params

module.exports = function () {

    if (!config.get('jwtPrivateKey')) {
//      console.error('FATAL ERROR: jwtPrivateKey is not defined.');
//      process.exit(1);
        throw new Error('jwtPrivateKey is not defined.');
    }

    if (!config.get('mongoUrl')) {
//      console.error('FATAL ERROR: mongoUrl is not defined.');
//      process.exit(1);
        throw new Error('mongoUrl is not defined.');
    }

}