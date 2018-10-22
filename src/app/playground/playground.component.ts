import { Component, ViewChild } from '@angular/core';

@Component( {
	selector: 'app-playground',
	templateUrl: './playground.component.html',
	styleUrls: [ './playground.component.css' ]
} )
export class PlaygroundComponent {

	@ViewChild( 'classic' ) classic;

	@ViewChild( 'inline' ) inline;

	data = '<h1>This is <strong>CKEditor 4</strong> Angular Integration Sample!</h1>';
	hide = false;
	remove = false;
	disabled = false;

	destroy() {
		this.classic.ngOnDestroy();
		this.inline.ngOnDestroy();
	}

	constructor() {
		( <any>window ).component = this;
	}
}
