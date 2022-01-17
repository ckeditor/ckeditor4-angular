/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
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
