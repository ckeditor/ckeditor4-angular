/* eslint-env node */

const { execSync } = require( 'child_process' );
const { mkdirSync, rmdirSync, copyFileSync, readFileSync, writeFileSync, unlinkSync } = require( 'fs' );
const { copySync } = require( 'fs-extra' );
const { resolve: resolvePath } = require( 'path' );
const satisfiesSemver = require( 'semver/functions/satisfies' );
const semverMajor = require( 'semver/functions/major' );

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
const angularVersion = argv.angular || 'current';

const PACKAGE_PATH = resolvePath( __dirname, '..' );
const TESTS_PATH = resolvePath( PACKAGE_PATH, '..', 'angular-tests' );

const versionsPassed = [];
const versionsFailed = [];
const errorLogs = {};

try {
	console.log( '--- Ultimate CKEditor 4 - Angular Integration Tester ---' );
	console.log( `Running tests for: ${testedBrowser}` );

	cleanupTestDir();

	getVersionsToTest().forEach( version => {
		prepareTestDir( version );
		// testVersion( version );
	} );
	// [ '7.3.10' ].forEach( version => {
	// 	prepareTestDir( version );
	// 	// testVersion( version );
	// } );

	if ( Object.keys( errorLogs ).length === 0 ) {
		console.log( '--- Done without errors. Have a nice day! ---' );
	} else {
		logResults( errorLogs );
	}
} catch ( error ) {
	console.log( error );
	console.log( '--- Unexpected error occured during testing - see the log above. ---' );
	process.exit( 1 );
}

/**
 * Removes test directory and its content, then re-creates empty test dir.
 */
function cleanupTestDir() {
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
	switch ( angularVersion ) {
		case 'all':
			return getAllAngularVersions();
		case 'current':
			return [ getCurrentAngularVersion() ];
		default:
			return [ angularVersion ];
	}
}

/**
 * Gets list of all @angular/cli versions that can be tested.
 *
 * @returns {string[]} list of versions to test
 */
function getAllAngularVersions() {
	const packageInfo = require( '../package.json' );
	console.log( packageInfo );
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

	console.log( 'Versions that will be tested (' + latestPatches.length + '):', latestPatches );

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
	console.log( `--- Preparing package environment for Angular v${version} ---` );

	const filesToCopy = [
		'src/app',
		'src/ckeditor',
		'src/karma.conf.js',
		'src/test.tools.ts'
	];

	execNpmCommand(
		`init -y`,
		TESTS_PATH
	)

	execNpmCommand(
		`i @angular/cli@${version}`,
		TESTS_PATH
	);

	execNpxCommand(
		`ng new cke4-angular-tester`,
		TESTS_PATH
	)

	execNpmCommand(
		`i ckeditor4-integrations-common wait-until-promise karma-firefox-launcher karma-spec-reporter`,
		resolvePath( TESTS_PATH, 'cke4-angular-tester' )
	);

	execNpmCommand(
		`i ckeditor4-integrations-common wait-until-promise karma-firefox-launcher karma-spec-reporter zone.js@0.10.3`,
		resolvePath( TESTS_PATH, 'cke4-angular-tester' )
	);

	unlinkSync( resolvePath(TESTS_PATH, 'cke4-angular-tester/src/app/app.component.spec.ts') );

	copyFiles( filesToCopy, PACKAGE_PATH, resolvePath( TESTS_PATH, 'cke4-angular-tester' ) );

	let res = readFileSync( resolvePath( TESTS_PATH, 'cke4-angular-tester/src/app/demo-form/demo-form.component.ts' ), { encoding: 'utf-8' } );
	let result = res.replace( /, { static: true }/g, '' );

	writeFileSync( resolvePath( TESTS_PATH, 'cke4-angular-tester/src/app/demo-form/demo-form.component.ts' ), result );

	execNpxCommand(
		`ng test`,
		resolvePath( TESTS_PATH, 'cke4-angular-tester' )
	);

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
 * @param {string} files list of files and dirs
 * @param {string} src source path
 * @param {string} dest destination path
 */
function copyFiles( files, src, dest ) {
	files.forEach( file => {
		const srcPath = resolvePath( src, file );
		const destPath = resolvePath( dest, file );

		copySync( srcPath, destPath );
	} );
}



function logResults( errorLogs ) {
	console.log( '---------------------------------------------------------------------------' );
	console.log( '------------------------- Logs of failed versions -------------------------' );
	console.log( '---------------------------------------------------------------------------' );
	console.log();

	for ( const key in errorLogs ) {
		console.log( '--- ' + key + ' ---', errorLogs[ key ] );
	}

	console.log( '--- Some versions failed. See the logs above. ---' );
	console.log( 'Successful tests:' );
	console.log( versionsPassed );
	console.log();
	console.log( 'Failed tests:' );
	console.log( versionsFailed );

	process.exit( 1 );
}
