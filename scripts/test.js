// This script is a workaround for Angular CLI not allowing to run tests with custom options.
// Manually running `karma start ./src/karma.conf.js` doesn't work either.
// Some of the plugins check if test is run by Angular CLI, and if not, they throw errors.
// https://github.com/angular/angular-cli/issues/12305

const minimist = require( 'minimist' );
const { spawn } = require( 'child_process' );
const options = parseArguments( process.argv.slice( 2 ) );
const env = Object.create( process.env );

env.KARMA_OPTIONS = JSON.stringify( options );

spawn( 'ng', [ 'test' ], {
	stdio: 'inherit', // Pass parent's stdio's to child. Without that option no logs will be visible.
	env
} );

/**
 * @param {Array.<String>} args CLI arguments and options.
 * @returns {Object} options
 * @returns {Boolean} options.url The `ckeditor.js` url to be included by karma.
 * @returns {Boolean} options.watch Whether to watch the files for changes.
 */
function parseArguments( args ) {
	const config = {
		string: [
			'url'
		],

		boolean: [
			'watch'
		],

		alias: {
			u: 'url',
			w: 'watch'
		}
	};

	const options = minimist( args, config );

	// Delete all aliases because we don't want to use them in the code.
	// They are useful when calling command but useless after that.
	for ( const alias of Object.keys( config.alias ) ) {
		delete options[ alias ];
	}

	return options;
}
