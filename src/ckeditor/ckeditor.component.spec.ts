/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';

import { TestTools } from '../test.tools';

const whenEvent = TestTools.whenEvent;

declare var CKEDITOR: any;

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent,
		fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
			.compileComponents();
	} ) );

	describe( 'initialization', () => {
		beforeEach( () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		it( 'invalid should result in error logged to the console', () => {
			const saved = CKEDITOR,
				spy = spyOn( console, 'error', );

			CKEDITOR = undefined;

			fixture.detectChanges();

			CKEDITOR = saved;
			expect( spy ).toHaveBeenCalled();
		} );

		it( 'ready', () => {
			const spy = jasmine.createSpy();
			component.ready.subscribe( spy );

			fixture.detectChanges();

			whenEvent( 'ready', component ).then( () => {
				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );
	} );

	describe( 'when ready', () => {
		beforeEach( ( done ) => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;

			fixture.detectChanges();

			whenEvent( 'ready', component ).then( done );
		} );

		afterEach( ( done ) => {
			component.instance.once( 'destroy', done );
			fixture.destroy();
		} );

		it( 'should create', () => {
			expect( component ).toBeTruthy();
		} );


		describe( 'readOnly state', () => {
			it( 'simple usage', () => {
				fixture.detectChanges();

				expect( component.readOnly ).toBeFalsy();
				expect( component.instance.readOnly ).toBeFalsy();

				component.readOnly = true;

				expect( component.readOnly ).toBeTruthy();
				expect( component.instance.readOnly ).toBeTruthy();

				component.readOnly = false;

				expect( component.readOnly ).toBeFalsy();
				expect( component.instance.readOnly ).toBeFalsy();
			} );

			it( 'editor readOnly by the ControlValueAccessor', () => {
				fixture.detectChanges();
				component.setReadOnlyState( true );

				expect( component.readOnly ).toBeTruthy();
				expect( component.instance.readOnly ).toBeTruthy();
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

				expect( component.data ).toEqual( null );
				expect( component.instance.getData() ).toEqual( '' );
			} );

			it( 'should be configurable at the start of the component', () => {
				fixture.detectChanges();
				component.data = 'foo';

				expect( component.data ).toEqual( 'foo' );
				expect( component.instance.getData() ).toEqual( 'foo' );
			} );

			it( 'should be writeable by ControlValueAccessor', () => {
				fixture.detectChanges();
				component.writeValue( 'foo' );

				expect( component.instance.getData() ).toEqual( 'foo' );

				component.writeValue( 'bar' );

				expect( component.instance.getData() ).toEqual( 'bar' );
			} );
		} );

		describe( 'emitters', () => {
			it( 'change', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				component.instance.fire( 'change' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'focus', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.focus.subscribe( spy );

				component.instance.fire( 'focus' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'blur', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.blur.subscribe( spy );

				component.instance.fire( 'blur' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( 'control value accessor callbacks', () => {
			it( 'onTouched callback should be called when editor is blurred', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();

				component.registerOnTouched( spy );

				component.instance.fire( 'blur' );

				expect( spy ).toHaveBeenCalled();
			} );

			it( 'onChange callback should be called when editor model changes', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.registerOnChange( spy );

				component.instance.once( 'dataReady', () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
				} );

				component.instance.setData( 'initial' );
			} );
		} );
	} );
} );

