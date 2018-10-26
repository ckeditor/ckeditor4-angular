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
		await el.sendKeys( ...keys );
	}

	selectAll() {
		return browser.executeScript( 'document.execCommand( "selectAll", false, null )' );
	}
}
