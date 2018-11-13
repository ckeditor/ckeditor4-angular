import { Component } from '@angular/core';

import { CKEditor4 } from '../../ckeditor/ckeditor';

@Component( {
	selector: 'app-simple-usage',
	templateUrl: './simple-usage.component.html',
	styleUrls: [ './simple-usage.component.css' ]
} )
export class SimpleUsageComponent {
	public isDisabled = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	private _inlineData = `<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	set inlineData( data ) {
		if ( this.syncEditors ) {
			this.editorData = data;
		} else {
			this._inlineData = data;
		}
	}

	get inlineData() {
		if ( this.syncEditors ) {
			return this.editorData;
		}
		return this._inlineData;
	}

	isHidden = false;

	syncEditors = true;

	isRemoved = false;

	public componentEvents: string[] = [];

	toggleDisableEditors() {
		this.isDisabled = !this.isDisabled;
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
