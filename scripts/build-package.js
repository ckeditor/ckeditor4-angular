/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs-extra' ),
	childProcess = require( 'child_process' ),
	path = require( 'path' ),

	// Build package using ng-packagr.
	output = childProcess.execSync( 'ng-packagr -p src/ckeditor/package.json' );

console.log( output.toString() );

// And copy markdown files.
const filesToCopy = [
	'CHANGELOG.md',
	'LICENSE.md',
	'README.md'
];

for ( const file of filesToCopy ) {
	const src = path.join( process.cwd(), file );
	const dest = path.join( process.cwd(), 'dist', file );

	fs.copyFileSync( src, dest );
}

// Update the version of package in dist/package.json
const srcPackageJsonPath = path.join( process.cwd(), 'package.json' ),
	distPackageJsonPath = path.join( process.cwd(), 'dist', 'package.json' ),

	srcPackageJson = fs.readJsonSync( srcPackageJsonPath ),
	distPackageJson = fs.readJsonSync( distPackageJsonPath );

distPackageJson.version = srcPackageJson.version;

fs.writeJsonSync( distPackageJsonPath, distPackageJson, { spaces: 2 } );
