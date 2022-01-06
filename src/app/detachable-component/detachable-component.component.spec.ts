/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DetachableComponent } from './detachable-component.component';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import { whenEvent } from '../../test.tools';

import Spy = jasmine.Spy;

describe( 'DetachableComponent', () => {
	let component: DetachableComponent,
		fixture: ComponentFixture<DetachableComponent>,
		ckeditorComponents: CKEditorComponent[],
		debugElements: DebugElement[],
		spy: Spy;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ DetachableComponent ],
			imports: [ CKEditorModule, FormsModule ]
		} ).compileComponents();
	} ) );

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

	it( 'should create editor after adding it the DOM without throwing any errors ', async done => {
		fixture = TestBed.createComponent( DetachableComponent );
		component = fixture.componentInstance;

		// When there is `*ngIf` directive on component instance, we need another detectChanges.
		fixture.detectChanges();

		debugElements = fixture.debugElement.queryAll( By.directive( CKEditorComponent ) );
		ckeditorComponents = debugElements.map( debugElement => debugElement.componentInstance );

		fixture.detectChanges();

		await wait( 500 );

		component.reattachEditor();

		whenEach( ckeditorComponent => whenEvent( 'ready', ckeditorComponent ) ).then( done );
	} );

	function whenEach( callback ) {
		return Promise.all( ckeditorComponents.map( ckeditorComponent => callback( ckeditorComponent ) ) );
	}

	function wait( time ) {
		return new Promise( resolve => {
			setTimeout( resolve, time );
		} );
	}
} );
