/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';

declare var CKEDITOR: any;

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( CKEditorComponent );
		component = fixture.componentInstance;
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'invalid initialization', () => {
		it( 'should result in error logged to the console', () => {
			const saved = CKEDITOR,
				spy = spyOn( console, 'error', );

			CKEDITOR = undefined;

			fixture.detectChanges();

			CKEDITOR = saved;
			expect( spy ).toHaveBeenCalled();
		} );
	} );

	describe( 'disabled state', () => {
		it( 'simple usage', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				expect( component.disabled ).toBeFalsy();
				expect( component.instance.readOnly ).toBeFalsy();

				component.disabled = true;

				expect( component.disabled ).toBeTruthy();
				expect( component.instance.readOnly ).toBeTruthy();

				component.disabled = false;

				expect( component.disabled ).toBeFalsy();
				expect( component.instance.readOnly ).toBeFalsy();
			} );
		} );

		it( 'editor disabled by the ControlValueAccessor', () => {
			fixture.detectChanges();
			component.setDisabledState( true );

			return whenReady( component ).then( () => {
				expect( component.disabled ).toBeTruthy();
				expect( component.instance.readOnly ).toBeTruthy();
			} );
		} );
	} );

	describe( 'tagName', () => {
		it( 'should enable creating component on div element', () => {
			component.tagName = 'div';
			fixture.detectChanges();

			expect( fixture.nativeElement.lastChild.tagName ).toEqual( 'DIV' );
		} );
	} );

	describe( 'component data', () => {
		it( 'initial data should be empty', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				expect( component.data ).toEqual( '' );
				expect( component.instance.getData() ).toEqual( '' );
			} );
		} );

		it( 'should be configurable at the start of the component', () => {
			fixture.detectChanges();
			component.data = 'foo';

			return whenReady( component ).then( () => {
				expect( component.data ).toEqual( 'foo' );
				expect( component.instance.getData() ).toEqual( 'foo' );
			} );
		} );

		it( 'should be writeable by ControlValueAccessor', () => {
			fixture.detectChanges();
			component.writeValue( 'foo' );

			return whenReady( component ).then( () => {
				expect( component.instance.getData() ).toEqual( 'foo' );

				component.writeValue( 'bar' );

				expect( component.instance.getData() ).toEqual( 'bar' );
			} );
		} );
	} );

	describe( 'emitters', () => {
		it( 'ready', () => {
			const spy = jasmine.createSpy();
			component.ready.subscribe( spy );

			fixture.detectChanges();

			return whenReady( component ).then( () => {
				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		it( 'change', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				component.instance.fire( 'change' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		it( 'focus', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				const spy = jasmine.createSpy();
				component.focus.subscribe( spy );

				component.instance.fire( 'focus' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		it( 'blur', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				const spy = jasmine.createSpy();
				component.blur.subscribe( spy );

				component.instance.fire( 'blur' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );
	} );

	describe( 'control value accessor callbacks', () => {
		it( 'onTouched callback should be called when editor is blurred', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				const spy = jasmine.createSpy();

				component.registerOnTouched( spy );

				component.instance.fire( 'blur' );

				expect( spy ).toHaveBeenCalled();
			} );
		} );

		it( 'onChange callback should be called when editor model changes', () => {
			fixture.detectChanges();

			return whenReady( component ).then( () => {
				const spy = jasmine.createSpy();
				component.registerOnChange( spy );

				component.data = 'initial';
				component.instance.fire( 'change' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );
	} );
} );

function whenReady( component ) {
	return new Promise( res => {
		component.ready.subscribe( res );
	} ); // Make sure that instance is fully initialized.
}

// function wait( time?: number ) {
// 	return new Promise( res => {
// 		setTimeout( res, time );
// 	} );
// }
