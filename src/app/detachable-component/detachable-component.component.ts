/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component( {
	selector: 'app-detachable-component',
	templateUrl: './detachable-component.component.html',
	styleUrls: [ './detachable-component.component.css' ]
} )
export class DetachableComponent implements AfterViewInit {
	isReattached = false;

	@ViewChild( 'container' ) private containerElement: ElementRef;
	@ViewChild( 'editor' ) private editorElement: ElementRef;

	ngAfterViewInit(): void {
		console.log( 'Component loaded, deataching' );

		this.containerElement.nativeElement.removeChild( this.editorElement.nativeElement );
	}

	reattachEditor() {
		console.log( 'Button clicked, reattaching editor' );

		this.isReattached = true;
		this.containerElement.nativeElement.appendChild( this.editorElement.nativeElement );
	}
}
