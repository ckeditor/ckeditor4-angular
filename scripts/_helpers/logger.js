/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const chalk = require( 'chalk' );

/**
 * Small logging utility class.
 */
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

	logCode( message ) {
		console.log( chalk.italic.bold( message ) + '\n' );
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
				return 'bgGreen';
			case 'info':
				return 'bgBlue';
			case 'error':
				return 'bgRed';
		}
	}
}
