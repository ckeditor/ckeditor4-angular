import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage.component';
import { By } from '@angular/platform-browser';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import { DebugElement } from '@angular/core';

import { TestTools } from '../../test.tools';
import { FormsModule } from '@angular/forms';

const whenEvent = TestTools.whenEvent;

describe( 'SimpleUsageComponent', () => {
	let component: SimpleUsageComponent,
		fixture: ComponentFixture<SimpleUsageComponent>,
		ckeditorComponent: CKEditorComponent,
		debugElement: DebugElement;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ SimpleUsageComponent ],
			imports: [ CKEditorModule, FormsModule ]
		} )
			.compileComponents();
	} ) );

	beforeEach( ( done ) => {
		fixture = TestBed.createComponent( SimpleUsageComponent );
		component = fixture.componentInstance;

		// When there is `*ngIf` directive on component instance, we need another detectChanges.
		fixture.detectChanges();

		debugElement = fixture.debugElement.query( By.directive( CKEditorComponent ) );
		ckeditorComponent = debugElement.componentInstance;

		fixture.detectChanges();

		whenEvent( 'ready', ckeditorComponent ).then( done );
	} );

	afterEach( ( done ) => {
		if ( ckeditorComponent.instance ) {
			ckeditorComponent.instance.once( 'destroy', done );
		}
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'readOnly state', () => {
		it( 'should be set to false at start', () => {
			expect( component.isReadOnly ).toBeFalsy();
		} );

		it( 'should be synced', () => {
			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isReadOnly ).toBeTruthy();
			expect( ckeditorComponent.readOnly ).toBeTruthy();

			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isReadOnly ).toBeFalsy();
			expect( ckeditorComponent.readOnly ).toBeFalsy();
		} );
	} );

	describe( 'data', () => {
		it( 'should set initial data on the CKEditor component', () => {
			expect( ckeditorComponent.data )
				.toContain( '<p>Getting used to an entirely different culture can be challenging.' );
		} );

		it( 'should be synced with editorData property', () => {
			component.editorData = '<p>foo</p>\n';

			fixture.detectChanges();

			expect( ckeditorComponent.data ).toEqual( '<p>foo</p>\n' );
		} );
	} );

	describe( 'listeners', () => {
		it( 'ready should be called on ckeditorComponent.ready()', () => {
			ckeditorComponent.ready.emit();

			expect( component.componentEvents ).toContain( 'The editor is ready.' );
		} );

		it( 'change should be called on ckeditorComponent.change()', () => {
			ckeditorComponent.change.emit();

			expect( component.componentEvents ).toContain( 'Editor model changed.' );
		} );

		it( 'focus should be called on ckeditorComponent.focus()', () => {
			ckeditorComponent.focus.emit();

			expect( component.componentEvents ).toContain( 'Focused the editing view.' );
		} );

		it( 'blur should be called on ckeditorComponent.blur()', () => {
			ckeditorComponent.blur.emit();

			expect( component.componentEvents ).toContain( 'Blurred the editing view.' );
		} );
	} );
} );
