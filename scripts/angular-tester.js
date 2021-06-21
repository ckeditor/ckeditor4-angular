/* eslint-env node */

const { execSync } = require( 'child_process' );
const { mkdirSync, rmdirSync, unlinkSync } = require( 'fs' );
const { copySync } = require( 'fs-extra' );
const { resolve: resolvePath } = require( 'path' );
const satisfiesSemver = require( 'semver/functions/satisfies' );
const semverMajor = require( 'semver/functions/major' );
const chalk = require( 'chalk' );

/**
 *
 * Usage: `node ./scripts/angular-tester.js <command>`
 *
 * Commands:
 *
 * --browser <name>   Specifies environment to test.
 *                    ??? Possible values: 'Chrome', 'Firefox', 'BrowserStack_Safari', 'BrowserStack_Edge', 'BrowserStack_IE11', 'SSR'.
 *                    Defaults to: 'Chrome'.
 * --angular <version>  Specifies Angular version to test. Possible values: 'all', 'current' or specific version. Defaults to: 'current'.
 *
 */
const argv = require( 'minimist' )( process.argv.slice( 2 ) );
const testedBrowser = argv.browser || 'Chrome';
const testedNgVersions = getVersionsToTest();
const noRebuild = argv.nr || false;

const PACKAGE_PATH = resolvePath( __dirname, '..' );
const TESTS_PATH = resolvePath( PACKAGE_PATH, '..', 'angular-tests' );

const versionsPassed = [];
const versionsFailed = [];
const errorLogs = {};

class Logger {
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

const logger = new Logger();

try {
	logger.logBanner( 'info', 'Ultimate CKEditor4-Angular Integration Tester' )
	logger.logInfo( `Running tests for: ${chalk.cyan( testedBrowser )}` );
	logger.logInfo( `Angular versions to be tested: ${chalk.cyan( testedNgVersions )}\n` );
	logger.logHeader( 'Preparing testing directory' );

	testedNgVersions.forEach( version => {
		if ( noRebuild ) {
			logger.logWarning( '`no-rebuild` option detected; using existing testing directory.' );
		} else {
			cleanupTestDir();
			prepareTestDir( version );
		}
		testVersion( version );
	} );

	/* Versions that will be tested (7): [
	'6.2.9',  '7.3.10',
	'8.3.29', '9.1.15',
	'10.2.3', '11.2.14',
	'12.0.4'
	]
	'1.7.4' - not lts */

	if ( Object.keys( errorLogs ).length === 0 ) {
		logger.logHeader( 'success', 'Done without errors. Have a nice day!' );
	} else {
		logErrors( errorLogs );
	}
} catch ( error ) {
	// console.log( chalk.red( error ) );
	logger.logWarning( error );
	logger.logHeader( 'error', 'Unexpected error occured during testing - see the log above.' );
	// console.log( chalk.red( '------------------------------------------------------------------------' ) );
	// console.log( chalk.red( '----- Unexpected error occured during testing - see the log above. -----' ) );
	// console.log( chalk.red( '------------------------------------------------------------------------' ) );
	process.exit( 1 );
}

/**
 * Removes test directory and its content, then re-creates empty test dir.
 */
function cleanupTestDir() {
	// console.log( chalk.magenta( 'Recreating the testing directory...\n' ) );
	logger.logAction( 'Recreating the testing directory...' );

	rmdirSyncRecursive( TESTS_PATH );
	mkdirSync( TESTS_PATH );
}

/**
 * Removes directory and its children.
 *
 * @param {string} path dir path
 * @returns {undefined}
 */
function rmdirSyncRecursive( path ) {
	return rmdirSync( path, {
		recursive: true
	} );
}


/**
 * Gets list of Angular versions to test based on `--angular` argument.
 *
 * @returns {string[]} list of versions to be tested
 */
function getVersionsToTest() {
	switch ( argv.angular ) {
		case 'all':
			return getAllAngularVersions();
		case undefined:
			return [ getCurrentAngularVersion() ];
		default:
			return [ argv.angular ];
	}
}

/**
 * Gets list of all @angular/cli versions that can be tested.
 *
 * @returns {string[]} list of versions to test
 */
function getAllAngularVersions() {
	const packageInfo = require( '../package.json' );
	const availableVersions = getVersions();
	const semverRange = getAngularVersion( packageInfo );
	const versionsInRange = getVersionsInRange( semverRange, availableVersions );
	return getLatestPatches( versionsInRange );
}

/**
 * Gets list of available @angular/cli versions from npm.
 *
 * @returns {string[]}
 */
function getVersions() {
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

	logger.logInfo( `Versions that will be tested ( ${chalk.cyan( latestPatches.length )} ): ${chalk.cyan( latestPatches )}` );

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


/**
 * Prepares test dir by copying required files and installing dependencies.
 *
 * @param {string} version Angular version to test
 */
function prepareTestDir( version ) {
	logger.logHeader( `Preparing environment for ${chalk.italic( '@angular/cli@' + version )}` );

	const filesToCopy = [
		{ src: 'app', dest: 'app', versions: 'all' },
		{ src: 'ckeditor', dest: 'ckeditor', versions: 'all' },
		{ src: 'test.tools.ts', dest: 'test.tools.ts', versions: 'all' },
		{ src: 'assets/karma.conf.js', dest: 'karma.conf.js', versions: [ 6, 7 ] },
		{ src: 'assets/karma.conf.js', dest: '../karma.conf.js', versions: [ 8, 9, 10, 11, 12 ] },
		{ src: 'assets/tsconfig.json', dest: '../tsconfig.json', versions: [ 12 ] },
		{ src: 'assets/demo-form.component.ts', dest: 'app/demo-form/demo-form.component.ts', versions: [ 6, 7 ] }
	];

	console.log( chalk.magenta( `Initializing ${chalk.italic( 'package.json' )} file...\n` ) );
	logger.logAction( `Initializing ${chalk.italic( 'package.json' )} file...` );
	execNpmCommand(
		`init -y`,
		TESTS_PATH
	)

	console.log( chalk.magenta( `Installing ${chalk.italic( '@angular/cli' )} locally...\n` ) );
	logger.logAction( `Installing ${chalk.italic( '@angular/cli' )} locally...` );
	execNpmCommand(
		`i @angular/cli@${version}`,
		TESTS_PATH
	);

	console.log( chalk.magenta( 'Initializing Angular project...\n' ) );
	logger.logAction( 'Initializing Angular project...' );
	execNpxCommand(
		`ng new cke4-angular-tester`,
		TESTS_PATH
	)

	console.log( chalk.magenta( 'Installing other required packages...\n' ) );
	logger.logAction( 'Installing other required packages...' );
	execNpmCommand(
		`i ckeditor4-integrations-common wait-until-promise karma-firefox-launcher karma-spec-reporter`,
		resolvePath( TESTS_PATH, 'cke4-angular-tester' )
	);

	if ( [ 6, 7 ].indexOf( semverMajor( version ) ) >= 0 ) {
		execNpmCommand(
			`i zone.js@0.10.3`,
			resolvePath( TESTS_PATH, 'cke4-angular-tester' )
		);
	}

	console.log( chalk.magenta( 'Copying integration and tests files...\n' ) );
	logger.logAction( 'Copying integration and tests files...' );
	unlinkSync( resolvePath( TESTS_PATH, 'cke4-angular-tester/src/app/app.component.spec.ts' ) );
	copyFiles( {
		files: filesToCopy,
		src: resolvePath( PACKAGE_PATH, 'src' ),
		dest: resolvePath( TESTS_PATH, 'cke4-angular-tester/src' ),
		version: version
	} );
}


/**
 * Executes npm command.
 *
 * @param {string} command command to execute
 * @param {string} cwd dir where to execute command
 * @returns {string|Buffer}
 */
function execNpmCommand( command, cwd = __dirname ) {
	const cmd = `npm ${command}`;

	return execSync( cmd, {
		encoding: 'utf-8',
		cwd
	} );
}


/**
 * Executes npx command.
 *
 * @param {string} command command to execute
 * @param {string} cwd dir where to execute command
 * @returns {string|Buffer}
 */
function execNpxCommand( command, cwd = __dirname ) {
	const cmd = `npx ${command}`;

	return execSync( cmd, {
		encoding: 'utf-8',
		cwd
	} );
}


/**
 * Copies files and directories from source to dest.
 *
 * @param options
 * @param {string} options.files list of files and dirs
 * @param {string} options.src source path
 * @param {string} options.dest destination path
 * @param {string} options.version currently tested Angular version
 */
function copyFiles( options ) {
	options.files.forEach( file => {
		if ( file.versions === 'all' || file.versions.indexOf( semverMajor( options.version ) ) >= 0 ) {
			const srcPath = resolvePath( options.src, file.src );
			const destPath = resolvePath( options.dest, file.dest );

			copySync( srcPath, destPath );
		}
	} );
}


/**
 * Runs tests for requested Angular version and environment (see `--browser` arg).
 *
 * @param {string} version Angular version to test
 */
function testVersion( version ) {
	try {
		console.log( chalk.bgBlue.bold( `--- Testing ${chalk.italic( '@angular/cli@' + version )} ---\n` ) );
		logger.logHeader( `Testing ${chalk.italic( '@angular/cli@' + version )}` );
		// process.env.REQUESTED_ANGULAR_VERSION = version;
		console.log( chalk.magenta( 'Executing tests...' ) );
		logger.logAction( 'Executing tests...' );
		execNpmCommand(
			`run test -- --browsers ${testedBrowser}`,
			resolvePath( TESTS_PATH, 'cke4-angular-tester' )
		);
		versionsPassed.push( version );
	} catch ( error ) {
		logger.logWarning( 'Errors occured during testing version ' + version + '. See the logs at the bottom after testing is finished.' );

		versionsFailed.push( version );
		errorLogs[ version ] = error.stdout;

		// throw error;
	}
}

function logErrors( errorLogs ) {
	logger.logBanner( 'error', 'Logs of failed versions' );
	// console.log( chalk.red( '---------------------------------------------------------------------------' ) );
	// console.log( chalk.red( '------------------------- Logs of failed versions -------------------------' ) );
	// console.log( chalk.red( '---------------------------------------------------------------------------' ) );
	// console.log();

	for ( const key in errorLogs ) {
		logger.logInfo( key );
		logger.logWarning( errorLogs[ key ] );
		// console.log( chalk.magenta( '--- ' + key + ' ---' ), chalk.yellow( errorLogs[ key ] ) );
	}

	logger.logBanner( 'error', 'Testing done. Some versions failed. See the logs above.' );
	// console.log( chalk.red( '----- Testing done. Some versions failed. See the logs above. -----\n' ) );
	logger.logInfo( 'Successfully tested versions:' );
	logger.logInfo( chalk.green( versionsPassed + '\n' ) );
	logger.logInfo( 'Unsuccessfully tested versions:' );
	logger.logInfo( chalk.red( versionsFailed ) + '\n' );

	process.exit( 1 );
}
