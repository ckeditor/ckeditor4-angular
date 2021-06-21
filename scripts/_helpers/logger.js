const chalk = require( 'chalk' );

module.exports = class Logger {
	constructor() {}

	logBanner( type, message ) {
		console.log( chalk.bold[ this._getColor( type ) ](
			this._decorateBanner( message ) + '\n'
		) );
	}

	logHeader( message ) {
		console.log( chalk.bold.bgBlue(
			this._decorateHeader( message ) + '\n'
		) );
	}

	logAction( message ) {
		console.log( chalk.magenta( message ) + '\n' );
	}

	logWarning( message ) {
		console.log( chalk.yellow( message ) + '\n' );
	}

	logInfo( message ) {
		console.log( message );
	}

	_decorateBanner( message ) {
		message = '----- ' + message + ' -----';

		return '-'.repeat( message.length ) + '\n' + message + '\n' + '-'.repeat( message.length );
	}

	_decorateHeader( message ) {
		return '--- ' + message + ' ---';
	}

	_getColor( type ) {
		switch ( type ) {
			case 'success':
				return 'green';
			case 'info':
				return 'blue';
			case 'error':
				return 'red';
		}
	}
}
