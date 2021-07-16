/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { execSync } = require( 'child_process' );
const { rmdirSync } = require( 'fs' );
const { resolve: resolvePath } = require( 'path' );
const { copySync } = require( 'fs-extra' );
const semverMajor = require( 'semver/functions/major' );
const Logger = require( './logger' );

const logger = new Logger();


/**
 * Executes npm command.
 *
 * @param {string} command command to execute
 * @param {string} cwd dir where to execute command
 * @returns {string|Buffer}
 */
function execNpmCommand( command, cwd = __dirname ) {
	const cmd = `npm ${command}`;

	logger.logCode( `${cwd} > ${cmd}` );

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

	logger.logCode( `${cwd} > ${cmd}` );

	return execSync( cmd, {
		encoding: 'utf-8',
		cwd
	} );
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
 * Copies files and directories matching currently tested ng version from source to dest.
 *
 * @param {Object} options
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

module.exports = {
	execNpmCommand: execNpmCommand,
	execNpxCommand: execNpxCommand,
	rmdirSyncRecursive: rmdirSyncRecursive,
	copyFiles: copyFiles
}