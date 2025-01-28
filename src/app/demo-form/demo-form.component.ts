/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	Component,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import { NgForm } from '@angular/forms';

@Component( {
	selector: 'app-demo-form',
	templateUrl: './demo-form.component.html',
	styleUrls: [ './demo-form.component.css' ]
} )

export class DemoFormComponent implements AfterViewInit {
	@ViewChild( 'demoForm', { static: true } ) demoForm?: NgForm;

	public model = {
		name: 'John',
		surname: 'Doe',
		description: '<p>A <b>really</b> nice fellow.</p>'
	};

	public formDataPreview?: string;

	ngAfterViewInit() {
		this.demoForm!.control.valueChanges
			.subscribe( values => this.formDataPreview = JSON.stringify( values ) );
	}

	onSubmit() {
		console.log( 'Form submit, model', this.model );
	}

	reset() {
		this.demoForm!.reset();
	}

	get description() {
		return this.demoForm!.controls.description;
	}
}
