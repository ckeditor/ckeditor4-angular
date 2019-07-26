/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { protractor, browser, by, element, WebElement, ElementFinder } from 'protractor';

export class AppPage {
	public navigateTo( target: string = '' ) {
		return browser.get( `/${ target }` );
	}

	public getParagraphText() {
		return element( by.css( 'app-root h1' ) ).getText();
	}

	public waitForElement( el: ElementFinder ) {
		return browser.wait( protractor.ExpectedConditions.presenceOf( el ) ).then( () => el );
	}

	public async getEditable() {
		return this.getElementByCss( '.cke_editable:not(.cke_editable_inline)' );
	}

	public getInlineEditable() {
		return this.getElementByCss( '.cke_editable_inline' );
	}

	public async getElementByCss( query ) {
		const el = await element( by.css( query ) );
		await this.waitForElement( el );
		return el;
	}

	public getHtmlString( el: WebElement ) {
		return el.getAttribute( 'innerHTML' ).then( str => str.replace( /\u200B/g, '' ) );
	}

	public async updateValue( el: WebElement, keys: string[] ) {
		await el.click();
		await this.selectAll();
		await el.sendKeys( ...keys );
	}

	public selectAll() {
		return browser.executeScript( 'document.execCommand( "selectAll", false, null )' );
	}
}
