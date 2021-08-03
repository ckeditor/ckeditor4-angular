/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { execNpmCommand } = require( './tools' );

/**
 * Gets list of Angular versions to test based on `--angular` argument.
 *
 * @param {string} version
 * @returns {string[]} the list of versions to be tested
 */
function getVersions( version ) {
	switch ( version ) {
		case 'all':
			return getImportantVersions();
		case 'current':
			return [ getCurrentAngularVersion() ];
		case undefined:
			return [ getLatestAngularVersion() ];
		default:
			return [ version ];
	}
}


/**
 * Gets the list of versions to test based on package dist-tags.
 *
 * @returns {[string]} the list of current, next and lts versions
 */
function getImportantVersions() {
	const commandResult = execNpmCommand( 'view @angular/cli dist-tags --json' );
	const versions = JSON.parse( commandResult );

	return Object.values( versions );
}


/**
 * Gets currently installed version of Angular.
 *
 * @returns {string} Angular version
 */
function getCurrentAngularVersion() {
	return require( '@angular/cli/package.json' ).version;
}


/**
 * Gets the latest @angular/cli version available on npm.
 *
 * @returns {string} the latest available @angular/cli version.
 */
function getLatestAngularVersion() {
	const commandResult = execNpmCommand( 'view @angular/cli dist-tags --json' );
	const versions = JSON.parse( commandResult );

	return versions.latest;
}

module.exports = getVersions;
