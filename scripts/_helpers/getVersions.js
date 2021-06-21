const satisfiesSemver = require( 'semver/functions/satisfies' );
const semverMajor = require( 'semver/functions/major' );
const { execNpmCommand } = require( './tools' );

/**
 * Gets list of Angular versions to test based on `--angular` argument.
 *
 * @param {string} command
 * @returns {string[]} list of versions to be tested
 */
function getVersions( command ) {
	switch ( command ) {
		case 'all':
			return getAllAngularVersions();
		case undefined:
			return [ getCurrentAngularVersion() ];
		default:
			return [ command ];
	}
}

/**
 * Gets list of all @angular/cli versions that can be tested.
 *
 * @returns {string[]} list of versions to test
 */
function getAllAngularVersions() {
	const packageInfo = require( '../../package.json' );
	const availableVersions = getNpmVersions();
	const semverRange = getAngularVersion( packageInfo );
	const versionsInRange = getVersionsInRange( semverRange, availableVersions );
	return getLatestPatches( versionsInRange );
}

/**
 * Gets list of available @angular/cli versions from npm.
 *
 * @returns {string[]}
 */
function getNpmVersions() {
	const commandResult = execNpmCommand( 'view @angular/cli versions --json' );
	const versions = JSON.parse( commandResult );

	return versions;
}

/**
 * Gets peered version range from `package.json`.
 *
 * @param {Object} packageInfo contents of `package.json`
 * @returns {string} peered version / version range
 */
function getAngularVersion( packageInfo ) {
	const peerDependencies = packageInfo.peerDependencies;
	const angular = peerDependencies[ '@angular/cli' ];

	return angular;
}

/**
 * Filters versions based on requested range.
 *
 * @param {string} range version range
 * @param {string[]} versions list of versions
 * @returns {string[]} versions in requested range
 */
function getVersionsInRange( range, versions ) {
	return versions.filter( version => {
		return satisfiesSemver( version, range );
	} );
}

/**
 * Gets latest patches for each major version.
 *
 * @param {string[]} versions list of versions
 * @returns {string[]} list of latest patches
 */
function getLatestPatches( versions ) {
	const latestPatches = versions.reduce( ( acc, version, index, array ) => {
		if ( isLatestPatch( index, array ) ) {
			acc.push( version );
		}

		return acc;
	}, [] );

	// @todo
	// logger.logInfo( `Versions that will be tested ( ${chalk.cyan( latestPatches.length )} ): ${chalk.cyan( latestPatches )}` );

	return latestPatches;
}

/**
 * Checks if version is latest patch of given list of versions.
 *
 * @param {number} index current index
 * @param {string[]} array list of versions
 * @returns {boolean} if version is latest patch
 */
function isLatestPatch( index, array ) {
	// Skip checking the last array element.
	if ( array.length == index + 1 ) {
		return true;
	}

	if ( semverMajor( array[ index ] ) != semverMajor( array[ index + 1 ] ) ) {
		return true;
	} else {
		return false;
	}
}


/**
 * Gets currently installed version of Angular.
 *
 * @returns {string} Angular version
 */
function getCurrentAngularVersion() {
	return require( '@angular/cli/package.json' ).version;
}

module.exports = getVersions;
