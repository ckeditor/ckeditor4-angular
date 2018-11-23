var configureKarma = require( './karma.conf.js' );

module.exports = function( config ) {
	// Load default configuration.
	configureKarma( config );

	config.set( {
		files: [
			'https://cdn.ckeditor.com/4.10.1/standard-all/ckeditor.js'
		],
		crossOriginAttribute: false
	} )
}
