import { Component, OnInit, ViewChild } from '@angular/core';

@Component( {
	selector: 'app-playground',
	templateUrl: './playground.component.html',
	styleUrls: [ './playground.component.css' ]
} )
export class PlaygroundComponent implements OnInit {

	@ViewChild( 'classic' ) classic;

	@ViewChild( 'inline' ) inline;

	public myModel: any;

	constructor() {
		(<any>window).component = this;
	}

	ngOnInit() {
	}

}
