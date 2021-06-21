/* eslint-env node */

const { mkdirSync, unlinkSync } = require( 'fs' );
const { resolve: resolvePath } = require( 'path' );
const semverMajor = require( 'semver/functions/major' );
const chalk = require( 'chalk' );

const Logger = require( './_helpers/logger' );
const getVersions = require( './_helpers/getVersions' );
const { execNpmCommand, execNpxCommand, rmdirSyncRecursive, copyFiles } = require( './_helpers/tools' );

/**
 *
 * Usage: `node ./scripts/angular-tester.js <command>`
 *
 * Commands:
 *
 * --browser <name>   Specifies environment to test.
 *                    ??? Possible values: 'Chrome', 'Firefox', 'BrowserStack_Safari', 'BrowserStack_Edge', 'BrowserStack_IE11'.
 *                    Defaults to: 'Chrome'.
 * --angular <version>  Specifies Angular version to test. Possible values: 'all', 'current' or specific version. Defaults to: 'current'.
 *
 */
const argv = require( 'minimist' )( process.argv.slice( 2 ) );
const testedBrowser = argv.browser || 'Chrome';
const testedNgVersions = getVersions( argv.angular );
const noRebuild = argv.nr || false;

const PACKAGE_PATH = resolvePath( __dirname, '..' );
const TESTS_PATH = resolvePath( PACKAGE_PATH, '..', 'angular-tests' );

const versionsPassed = [];
const versionsFailed = [];
const errorLogs = {};

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
	logger.logWarning( error );
	logger.logHeader( 'error', 'Unexpected error occured during testing - see the log above.' );

	process.exit( 1 );
}


/**
 * Removes test directory and its content, then re-creates empty test dir.
 */
function cleanupTestDir() {
	logger.logAction( 'Recreating the testing directory...' );

	rmdirSyncRecursive( TESTS_PATH );
	mkdirSync( TESTS_PATH );
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

	logger.logAction( `Initializing ${chalk.italic( 'package.json' )} file...` );
	execNpmCommand(
		`init -y`,
		TESTS_PATH
	)

	logger.logAction( `Installing ${chalk.italic( '@angular/cli' )} locally...` );
	execNpmCommand(
		`i @angular/cli@${version}`,
		TESTS_PATH
	);

	logger.logAction( 'Initializing Angular project...' );
	execNpxCommand(
		`ng new cke4-angular-tester`,
		TESTS_PATH
	)

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
 * Runs tests for requested Angular version and environment (see `--browser` arg).
 *
 * @param {string} version Angular version to test
 */
function testVersion( version ) {
	try {
		logger.logHeader( `Testing ${chalk.italic( '@angular/cli@' + version )}` );
		// process.env.REQUESTED_ANGULAR_VERSION = version;
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


/**
 * Displays versions and corresponding failed tests.
 *
 * @param {object} errorLogs key-value pairs of ng versions and failed tests
 */
function logErrors( errorLogs ) {
	logger.logBanner( 'error', 'Logs of failed versions' );

	for ( const key in errorLogs ) {
		logger.logInfo( key );
		logger.logWarning( errorLogs[ key ] );
	}

	logger.logBanner( 'error', 'Testing done. Some versions failed. See the logs above.' );
	logger.logInfo( 'Successfully tested versions:' );
	logger.logInfo( chalk.green( versionsPassed + '\n' ) );
	logger.logInfo( 'Unsuccessfully tested versions:' );
	logger.logInfo( chalk.red( versionsFailed ) + '\n' );

	process.exit( 1 );
}
