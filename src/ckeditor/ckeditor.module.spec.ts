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
