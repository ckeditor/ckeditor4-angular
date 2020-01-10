/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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

	editors = [ 'Classic', 'Divarea', 'Inline' ];

	isHidden = false;

	isRemoved = false;

	public componentEvents: string[] = [];

	toggleDisableEditors() {
		this.isReadOnly = !this.isReadOnly;
	}

	onReady( editor: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `${editorName} editor is ready.` );
	}

	onChange( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `${editorName} editor model changed.` );
	}

	onFocus( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Focused ${editorName.toLowerCase()} editing view.` );
	}

	onBlur( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Blurred ${editorName.toLowerCase()} editing view.` );
	}
}
