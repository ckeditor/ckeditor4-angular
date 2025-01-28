/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SimpleUsageComponent } from './simple-usage.component';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import { whenEvent } from '../../test.tools';

import Spy = jasmine.Spy;

declare var CKEDITOR: any;
declare var __karma__: {
	config: {
		args: [ string ];
	}
};

describe( 'SimpleUsageComponent', () => {
	let component: SimpleUsageComponent,
		fixture: ComponentFixture<SimpleUsageComponent>,
		ckeditorComponents: CKEditorComponent[],
		debugElements: DebugElement[],
		spy: Spy;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ SimpleUsageComponent ],
			imports: [ CKEditorModule, FormsModule ]
		} ).compileComponents();
	} ) );

	beforeEach( done => {
		fixture = TestBed.createComponent( SimpleUsageComponent );
		component = fixture.componentInstance;

		// When there is `*ngIf` directive on component instance, we need another detectChanges.
		fixture.detectChanges();

		debugElements = fixture.debugElement.queryAll( By.directive( CKEditorComponent ) );
		ckeditorComponents = debugElements.map( debugElement => debugElement.componentInstance );

		ckeditorComponents.forEach( ( ckeditorComponent ) => {
			ckeditorComponent.namespaceLoaded.subscribe( () => {
				CKEDITOR.config.licenseKey = __karma__.config.args[ 0 ];
			} );
		} );

		fixture.detectChanges();

		whenEach( ckeditorComponent => whenEvent( 'ready', ckeditorComponent ) ).then( done );
	} );

	afterEach( done => {
		whenEach( ckeditorComponent =>
			new Promise( res => {
				if ( ckeditorComponent.instance ) {
					ckeditorComponent.instance.once( 'destroy', res );
				}
			} )
		).then( done );

		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	it( 'readOnly should be set to false at start', () => {
		expect( component.isReadOnly ).toBeFalsy();
	} );

	it( 'when component readOnly is changed on component editor readOnly should reflect change', () => {
		component.toggleDisableEditors();
		fixture.detectChanges();

		expect( component.isReadOnly ).toBeTruthy();
		each( ckeditorComponent => {
			expect( ckeditorComponent.readOnly ).toBeTruthy();
		} );

		component.toggleDisableEditors();
		fixture.detectChanges();

		expect( component.isReadOnly ).toBeFalsy();
		each( ckeditorComponent => {
			expect( ckeditorComponent.readOnly ).toBeFalsy();
		} );
	} );

	describe( 'data', () => {
		it( 'should set initial data on the CKEditor component', () => {
			each( ckeditorComponent => {
				expect( ckeditorComponent.data )
					.toContain( '<p>Getting used to an entirely different culture can be challenging.' );
			} );
		} );

		it( 'should be synced with editorData property', () => {
			return getEditorNamespace( ckeditorComponents[ 0 ].editorUrl )
				.then( CKEDITOR => {
					component.editorData = '<p>foo</p>\n';

					fixture.detectChanges();

					each( ckeditorComponent => {
						expect( ckeditorComponent.data ).toEqual( '<p>foo</p>\n' );
					} );
				} );
		} );
	} );

	describe( 'listeners', () => {
		beforeEach( () => {
			spy = spyOn( console, 'log' );
		} );

		it( 'ready should be called on ckeditorComponent.ready()', () => {
			each( ( ckeditorComponent, name ) => {
				ckeditorComponent.ready.emit();

				expect( spy ).toHaveBeenCalledWith( `${ name } editor is ready.` );
			} );
		} );

		it( 'change should be called on ckeditorComponent.change()', () => {
			each( ( ckeditorComponent, name ) => {
				ckeditorComponent.change.emit();

				expect( spy ).toHaveBeenCalledWith( `${ name } editor model changed.` );
			} );
		} );

		it( 'focus should be called on ckeditorComponent.focus()', () => {
			each( ( ckeditorComponent, name ) => {
				ckeditorComponent.focus.emit();

				name = name.toLowerCase();

				expect( spy ).toHaveBeenCalledWith( `Focused ${ name } editing view.` );
			} );
		} );

		it( 'blur should be called on ckeditorComponent.blur()', () => {
			each( ( ckeditorComponent, name ) => {
				ckeditorComponent.blur.emit();

				name = name.toLowerCase();

				expect( spy ).toHaveBeenCalledWith( `Blurred ${ name } editing view.` );
			} );
		} );
	} );

	function whenEach( callback ) {
		return Promise.all( ckeditorComponents.map( ckeditorComponent => callback( ckeditorComponent ) ) );
	}

	function each( callback ) {
		ckeditorComponents.forEach( item => {
			let name: String = item.type;

			name = name[ 0 ].toUpperCase() + name.slice( 1 );

			callback( item, name );
		} );
	}
} );
