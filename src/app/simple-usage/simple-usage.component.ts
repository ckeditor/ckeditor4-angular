/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Component } from '@angular/core';

import { CKEditor4 } from '../../ckeditor/ckeditor';

@Component( {
	selector: 'app-simple-usage',
	templateUrl: './simple-usage.component.html',
	styleUrls: [ './simple-usage.component.css' ]
} )
export class SimpleUsageComponent {
	public isReadOnly = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;


	isHidden = false;

	isRemoved = false;

	public componentEvents: string[] = [];

	toggleDisableEditors() {
		this.isReadOnly = !this.isReadOnly;
	}

	onReady( editor: CKEditor4.EventInfo ): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	onChange( event: CKEditor4.EventInfo ): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	onFocus( event: CKEditor4.EventInfo ): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	onBlur( event: CKEditor4.EventInfo ): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}
}
