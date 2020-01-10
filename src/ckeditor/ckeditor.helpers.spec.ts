/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getEditorNamespace } from './ckeditor.helpers';

declare let CKEDITOR: any;

describe( 'getEditorNamespace', () => {
	const fakeScript = 'data:text/javascript;base64,d2luZG93LkNLRURJVE9SID0ge307';
	let isIe10 = navigator.userAgent.toLowerCase().indexOf( 'trident/' ) > -1;
	isIe10 = isIe10 && document[ 'documentMode' ] === 10;

	beforeEach( () => {
		delete window[ 'CKEDITOR' ];
	} );

	it( 'is a function', () => {
		expect( typeof getEditorNamespace === 'function' ).toBeTruthy();
	} );

	it( 'typeError thrown when empty string passed', () => {
		expect( () => {
			getEditorNamespace( '' );
		} ).toThrowError( 'CKEditor URL must be a non-empty string.' );
	} );

	it( 'returns promise even if namespace is present', () => {
		window[ 'CKEDITOR' ] = {};

		const namespacePromise = getEditorNamespace( 'test' );
		expect( namespacePromise instanceof Promise ).toBeTruthy();

		return namespacePromise.then( namespace => {
			expect( namespace ).toBe( CKEDITOR );
		} );
	} );

	if ( !isIe10 ) { // Ignore unstable test on IE10.
		it( 'load script and resolves with loaded namespace', () => {
			return getEditorNamespace( fakeScript ).then( namespace => {
				expect( namespace ).toBe( CKEDITOR );
			} );
		} );
	}

	it( 'rejects with error when script cannot be loaded', () => {
		return getEditorNamespace( 'non-existent.js' ).catch( err => {
			expect( err instanceof Error ).toBeTruthy();
		} );
	} );

	it( 'returns the same promise', () => {
		expect( getEditorNamespace( fakeScript ) ).toBe( getEditorNamespace( fakeScript ) );
	} );
} );
