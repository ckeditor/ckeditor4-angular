/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
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

	async waitForElement( el: ElementFinder ) {
		return browser.wait( protractor.ExpectedConditions.presenceOf( el ) ).then( () => el );
	}

	async getEditable() {
		return this.getElementByCss( '.cke_editable:not(.cke_editable_inline)' );
	}

	async getInlineEditable() {
		return this.getElementByCss( '.cke_editable_inline' );
	}

	async getElementByCss( query ) {
		const el = await element( by.css( query ) );
		await this.waitForElement( el );
		return el;
	}

	async getHtmlString( el: WebElement ) {
		return el.getAttribute( 'innerHTML' );
	}

	async updateValue( el: WebElement, text: string ) {
		await el.clear();
		await el.click();

		for ( let i = 0; i < text.length; i++ ) {
			await el.sendKeys( text.charAt( i ) );
		}
	}
}
