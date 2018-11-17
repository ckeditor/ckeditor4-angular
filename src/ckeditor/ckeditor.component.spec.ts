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

	describe( 'on initialization', () => {
		beforeEach( () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		it( 'when CKEDITOR namespace is missing should log error to the console', () => {
			const saved = CKEDITOR,
				spy = spyOn( console, 'error', );

			CKEDITOR = undefined;

			fixture.detectChanges();

			CKEDITOR = saved;
			expect( spy ).toHaveBeenCalled();
		} );

		it( 'when component is ready should emit ready event', () => {
			const spy = jasmine.createSpy();
			component.ready.subscribe( spy );

			fixture.detectChanges();

			whenEvent( 'ready', component ).then( () => {
				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( 'when set with config', () => {
			beforeEach( ( done ) => {
				component.config = {
					readOnly: true,
					width: 1000,
					height: 1000
				};
				fixture.detectChanges();
				whenEvent( 'ready', component ).then( done );
			} );

			it( 'editor should be readOnly', () => {
				expect( component.instance.readOnly ).toBeTruthy();
			} );

			it( 'editor should have width and height', () => {
				expect( component.instance.config.width ).toBe( 1000 );
				expect( component.instance.config.height ).toBe( 1000 );
			} );
		} );
	} );

	describe( 'when component is ready', () => {
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

		it( 'should be initialized', () => {
			expect( component ).toBeTruthy();
		} );


		it( "editor shouldn't be read-only", () => {
			fixture.detectChanges();

			expect( component.readOnly ).toBeFalsy();
			expect( component.instance.readOnly ).toBeFalsy();
		} );

		describe( 'with changed read-only mode', () => {
			it( 'should allow to enable read-only mode', () => {
				component.readOnly = true;

				expect( component.readOnly ).toBeTruthy();
				expect( component.instance.readOnly ).toBeTruthy();
			} );

			it( 'should allow to disable read-only mode', () => {
				component.readOnly = false;

				expect( component.readOnly ).toBeFalsy();
				expect( component.instance.readOnly ).toBeFalsy();
			} );
		} );

		describe( 'with tagName set to div', () => {
			beforeEach( () => {
				component.tagName = 'div';
				fixture.detectChanges();
			} );

			it( 'editor should be initialized using div element', () => {
				expect( fixture.nativeElement.lastChild.tagName ).toEqual( 'DIV' );
			} );
		} );

		it( 'initial data should be empty', () => {
			fixture.detectChanges();

			expect( component.data ).toEqual( null );
			expect( component.instance.getData() ).toEqual( '' );
		} );

		describe( 'component data', () => {
			const data = '<b>foo</b>',
				expected = '<p><strong>foo</strong></p>\n'

			it( 'should be configurable at the start of the component', () => {
				fixture.detectChanges();
				component.data = data;

				expect( component.data ).toEqual( expected );
				expect( component.instance.getData() ).toEqual( expected );
			} );

			it( 'should be writeable by ControlValueAccessor', () => {
				fixture.detectChanges();
				component.writeValue( data );

				expect( component.instance.getData() ).toEqual( expected );

				component.writeValue( '<p><i>baz</i></p>' );

				expect( component.instance.getData() ).toEqual( '<p><em>baz</em></p>\n' );
			} );
		} );

		describe( 'editor event', () => {
			it( 'change should emit component change', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				component.instance.fire( 'change' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'focus should emit component focus', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.focus.subscribe( spy );

				component.instance.fire( 'focus' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );

			it( 'blur should emit component blur', () => {
				fixture.detectChanges();

				const spy = jasmine.createSpy();
				component.blur.subscribe( spy );

				component.instance.fire( 'blur' );

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( 'when control value accessor callbacks are set', () => {
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

				whenEvent( 'change', () => {
					fixture.detectChanges();
					expect( spy ).toHaveBeenCalledTimes( 1 );
				} );

				component.instance.setData( 'initial' );
			} );
		} );
	} );
} );

