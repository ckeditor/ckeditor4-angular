/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { CKEditorModule } from './ckeditor.module';

describe( 'CKEditorModule', () => {
	let ckeditorModule: CKEditorModule;

	beforeEach( () => {
		ckeditorModule = new CKEditorModule();
	} );

	it( 'should create an instance', () => {
		expect( ckeditorModule ).toBeTruthy();
	} );
} );
