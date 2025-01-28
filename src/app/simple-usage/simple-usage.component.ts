/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
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

	editors = [ 'Classic', 'Inline' ];

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

	onPaste( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Pasted into ${editorName.toLowerCase()} editing view.` );
	}

	onAfterPaste( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `After pasted fired in ${editorName.toLowerCase()} editing view.` );
	}

	onDragStart( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Drag started in ${editorName.toLowerCase()} editing view.` );
	}

	onDragEnd( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Drag ended in ${editorName.toLowerCase()} editing view.` );
	}

	onDrop( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Dropped in ${editorName.toLowerCase()} editing view.` );
	}

	onFileUploadRequest( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `File upload requested in ${editorName.toLowerCase()} editor.` );
	}

	onFileUploadResponse( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `File upload responded in ${editorName.toLowerCase()} editor.` );
	}

	onNamespaceLoaded( event: CKEditor4.EventInfo, editorName: string ): void {
		console.log( `Namespace loaded by ${editorName.toLowerCase()} editor.` );
	}
}
