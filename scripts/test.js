const { spawn } = require( 'child_process' );
const options = parseArguments( process.argv.slice( 2 ) );
const env = Object.create( process.env );

env.CK_OPTIONS = JSON.stringify( options );

spawn( 'ng', [ 'test' ], {
	stdio: 'inherit',
	env
} );

function parseArguments( args ) {
	const minimist = require( 'minimist' );

	const config = {
		string: [
			'url'
		],

		alias: {
			u: 'url'
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
