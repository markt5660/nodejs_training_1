const EventEmitter = require('events');

const url = 'http://mylogger.io/log';

class Logger extends EventEmitter {
	
	log (message) {
		console.log(message);
		this.emit('logging', {id:123, url:url, data:message});
	}

}


module.exports = Logger;
