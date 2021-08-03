/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

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
 *                    Possible values: 'Chrome', 'Firefox', 'BrowserStack_Safari', 'BrowserStack_Edge', 'BrowserStack_IE11'.
 *                    Defaults to: 'Chrome'.
 * --angular <version>  Specifies Angular version to test. Possible values: 'all', 'current' or specific version. Defaults to: 'current'.
 *
 */
const argv = require( 'minimist' )( process.argv.slice( 2 ) );
const testedBrowser = argv.browser || 'Chrome';
const testedNgVersions = getVersions( argv.angular );
const noRebuild = argv.nr || false;

const PACKAGE_PATH = resolvePath( __dirname, '..' );
const TESTS_PATH = resolvePath( PACKAGE_PATH, '..', 'cke4-angular-tester' );
const TEST_APP_PATH = resolvePath( TESTS_PATH, 'cke4-angular-app' )

const versionsPassed = [];
const versionsFailed = [];
const errorLogs = {};

const logger = new Logger();

try {
	logger.logBanner( 'info', 'Ultimate CKEditor4-Angular Integration Tester' )
	logger.logInfo( `Running tests for: ${chalk.green( testedBrowser )}` );
	logger.logInfo( `Angular versions to be tested ( ${chalk.green( testedNgVersions.length ) } ):` );
	console.log( testedNgVersions );
	logger.logHeader( 'Preparing testing directory' );

	/* Versions with LTS: [
	'6.2.9',  '7.3.10',
	'8.3.29', '9.1.15',
	'10.2.3', '11.2.14'
	] */
	testedNgVersions.forEach( version => {
		if ( noRebuild ) {
			version = getPreparedNgVersion()
			logger.logWarning( '`no-rebuild` option detected; using existing testing directory with @angular/cli ' + version + ' instead.' );
		} else {
			cleanupTestDir();
			prepareTestDir( version );
		}
		testVersion( version );
	} );

	if ( Object.keys( errorLogs ).length === 0 ) {
		logger.logBanner( 'success', 'Done without errors. Have a nice day!' );
	} else {
		logErrors( errorLogs );
	}
} catch ( error ) {
	logger.logWarning( error );
	logger.logBanner( 'error', 'Unexpected error occured during testing - see the log above.' );

	process.exit( 1 );
}


/**
 * Finds the preinstalled @angular/cli version that will be tested.
 */
function getPreparedNgVersion() {
	return require( resolvePath( TESTS_PATH, 'package.json' ) ).dependencies[ '@angular/cli' ];
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
		{ src: 'src/app', dest: 'src/app', versions: 'all' },
		{ src: 'src/ckeditor', dest: 'src/ckeditor', versions: 'all' },
		{ src: 'src/test.tools.ts', dest: 'src/test.tools.ts', versions: 'all' },
		{ src: 'scripts/assets/karma.conf.js', dest: 'src/karma.conf.js', versions: [ 6, 7 ] },
		{ src: 'scripts/assets/karma.conf.js', dest: 'karma.conf.js', versions: [ 8, 9, 10, 11, 12 ] },
		{ src: 'scripts/assets/tsconfig.json', dest: 'tsconfig.json', versions: [ 12 ] },
		{ src: 'scripts/assets/demo-form.component.ts', dest: 'src/app/demo-form/demo-form.component.ts', versions: [ 6, 7 ] }
	];

	logger.logAction( 'Initializing Angular project...' );
	execNpxCommand(
		`npx ng new cke4-angular-app --skip-git`,
		TESTS_PATH
	)

	logger.logAction( 'Installing other required packages...' );
	execNpmCommand(
		`i ckeditor4-integrations-common wait-until-promise karma-firefox-launcher karma-spec-reporter karma-browserstack-launcher`,
		TEST_APP_PATH
	);

	if ( [ 6, 7 ].indexOf( semverMajor( version ) ) >= 0 ) {
		execNpmCommand(
			`i zone.js@0.10.3`,
			TEST_APP_PATH
		);
	}

	logger.logAction( 'Copying integration and tests files...' );
	unlinkSync( resolvePath( TEST_APP_PATH, 'src/app/app.component.spec.ts' ) );
	copyFiles( {
		files: filesToCopy,
		src: PACKAGE_PATH,
		dest: TEST_APP_PATH,
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
		logger.logAction( 'Executing tests...' );
		execNpmCommand(
			`run test -- --browsers ${testedBrowser}`,
			TEST_APP_PATH
		);

		logger.logWarning( `All tests for ${chalk.italic( '@angular/cli@' + version )} passed. Moving forward.` );

		versionsPassed.push( version );
	} catch ( error ) {
		logger.logWarning( 'Errors occured during testing version ' + version + '. See the logs at the bottom after testing is finished.' );

		versionsFailed.push( version );
		errorLogs[ version ] = error.stdout;
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
	logger.logInfo( versionsPassed );
	logger.logInfo( 'Unsuccessfully tested versions:' );
	logger.logInfo( versionsFailed );

	process.exit( 1 );
}
