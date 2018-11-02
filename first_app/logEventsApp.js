const Logger = require('./logger');
const logger = new Logger();

// Register a listener
logger.on('logging', (arg) => {
	console.log('Listener called', arg);
});

logger.log('Hello there');