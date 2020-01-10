/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { protractor, browser, by, element, WebElement, ElementFinder } from 'protractor';

export class AppPage {
	navigateTo( target: string = '' ) {
		return browser.get( `/${target}` );
	}

	getParagraphText() {
		return element( by.css( 'app-root h1' ) ).getText();
	}

	waitForElement( el: ElementFinder ) {
		return browser.wait( protractor.ExpectedConditions.presenceOf( el ) ).then( () => el );
	}

	async getEditable() {
		return this.getElementByCss( '.cke_editable:not(.cke_editable_inline)' );
	}

	getInlineEditable() {
		return this.getElementByCss( '.cke_editable_inline' );
	}

	async getElementByCss( query ) {
		const el = await element( by.css( query ) );
		await this.waitForElement( el );
		return el;
	}

	getHtmlString( el: WebElement ) {
		return el.getAttribute( 'innerHTML' ).then( str => str.replace( /\u200B/g, '' ) );
	}

	async updateValue( el: WebElement, keys: string[] ) {
		await el.click();
		await this.selectAll();
		// Since Chrome 77 with webdirver-manager@12.1.7 protractor.sendKeys() doesn't
		// clear current selection, we have to clean it manually (#51).
		await this.delete();
		await el.sendKeys( ...keys );
	}

	selectAll() {
		return browser.executeScript( 'document.execCommand( "selectAll", false, null )' );
	}

	delete() {
		return browser.executeScript( 'document.execCommand( "delete", false, null )' );
	}
}
