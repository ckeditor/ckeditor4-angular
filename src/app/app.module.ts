/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CKEditorModule } from '../ckeditor/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage/simple-usage.component';
import { DemoFormComponent } from './demo-form/demo-form.component';
import { DetachableComponent } from './detachable-component/detachable-component.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/simple-usage', pathMatch: 'full' },
	{ path: 'simple-usage', component: SimpleUsageComponent },
	{ path: 'forms', component: DemoFormComponent },
	{ path: 'detachable', component: DetachableComponent }
];

@NgModule( {
	imports: [
		BrowserModule,
		FormsModule,
		CKEditorModule,
		RouterModule.forRoot( appRoutes )
	],
	declarations: [
		AppComponent,
		DemoFormComponent,
		SimpleUsageComponent,
		DetachableComponent
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )

export class AppModule {
}
