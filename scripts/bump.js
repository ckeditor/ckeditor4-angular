/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* global process, require, __dirname */

const fs = require( 'fs' );
const path = require( 'path' );

const args = process.argv;

if ( !( args && args[ 2 ] && args[ 2 ].length > 2 ) ) {
	console.error( 'Missing CKEditor version! USAGE: npm run bump A.B.C, for example: npm run bump 4.11.5' );
	process.exit( 1 );
}

const version = args[ 2 ];

// Update the CDN link in the 'src/ckeditor/ckeditor.component.ts file.
updateCdnLink( path.resolve( __dirname, '..', 'src', 'ckeditor', 'ckeditor.component.ts' ) );

// Update the CDN link in the 'src/ckeditor/ckeditor.component.spec.ts' file.
updateCdnLink( path.resolve( __dirname, '..', 'src', 'ckeditor', 'ckeditor.component.spec.ts' ) );

function updateCdnLink( path ) {
	const file = fs.readFileSync( path, 'utf8' );
	const cdnLinkRegex = /https:\/\/cdn\.ckeditor\.com\/\d\.\d+\.\d+/g;

	fs.writeFileSync( path, file.replace( cdnLinkRegex, `https://cdn.ckeditor.com/${ version }` ), 'utf8' );
}
