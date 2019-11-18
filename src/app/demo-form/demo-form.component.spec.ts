/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { DemoFormComponent } from './demo-form.component';
import { By } from '@angular/platform-browser';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import { DebugElement } from '@angular/core';

import { TestTools } from '../../test.tools';

const whenEvent = TestTools.whenEvent;

describe( 'DemoFormComponent', () => {
	let component: DemoFormComponent,
		fixture: ComponentFixture<DemoFormComponent>,
		ckeditorComponent: CKEditorComponent,
		debugElement: DebugElement,
		originalTimeout: number;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ DemoFormComponent ],
			imports: [ FormsModule, CKEditorModule ]
		} )
			.compileComponents();
	} ) );

	beforeEach( ( done ) => {
		fixture = TestBed.createComponent( DemoFormComponent );
		component = fixture.componentInstance;
		debugElement = fixture.debugElement.query( By.directive( CKEditorComponent ) );
		ckeditorComponent = debugElement.componentInstance;

		fixture.detectChanges();

		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

		whenEvent( 'ready', ckeditorComponent ).then( done );
	} );

	afterEach( ( done ) => {
		if ( ckeditorComponent.instance ) {
			ckeditorComponent.instance.once( 'destroy', done );
		}
		fixture.destroy();

		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	it( 'on form submission should log the model to the console', () => {
		const spy = spyOn( console, 'log' );

		const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=submit]' ) ).nativeElement;
		submitButton.click();

		expect( spy ).toHaveBeenCalledTimes( 1 );
		expect( spy.calls.first().args ).toEqual( [
			'Form submit, model',
			{
				name: 'John',
				surname: 'Doe',
				description: '<p>A <strong>really</strong> nice fellow.</p>\n'
			}
		] );
	} );

	// This test passes when run solo or testes as first, but throws a type error when run after other tests.
	it( 'when change event is emitted should show form data preview', ( done: Function ) => {
		whenEvent( 'change', ckeditorComponent ).then( () => {
			fixture.detectChanges();
			expect( component.formDataPreview ).toEqual( '{"name":"John","surname":"Doe","description":"<p>An unidentified person</p>\\n"}' );
			done();
		} );

		ckeditorComponent.instance.setData( '<p>An unidentified person</p>' );

	} );

	it( 'when reset button is clicked should reset form', ( done: Function ) => {
		fixture.whenStable().then( () => {
			const resetButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=reset]' ) ).nativeElement;
			resetButton.click();

			fixture.detectChanges();
			expect( component.formDataPreview ).toEqual( '{"name":null,"surname":null,"description":null}' );

			done();
		} );
	} );

	[ {
		config: undefined,
		msg: 'with undo plugin'
	}, {
		config: { removePlugins: 'undo' },
		msg: 'without undo plugin'
	}].forEach( ( { config, msg } ) => {
		describe( msg, () => {
			beforeEach( () => {
				ckeditorComponent.config = config;
				fixture.detectChanges();
			} );
			it( 'should emit onChange event', () => {
				const spy = spyOn( ckeditorComponent, 'onChange' );

				ckeditorComponent.instance.setData( '<p>An unidentified person</p>' );
				fixture.detectChanges();

				expect( spy ).toHaveBeenCalledTimes( 1 );
			} );
		} );
	} );

} );
