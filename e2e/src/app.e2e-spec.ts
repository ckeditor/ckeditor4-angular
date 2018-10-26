import { AppPage } from './app.po';
import { protractor, WebElement } from 'protractor';

describe( 'workspace-project App', () => {
	let page: AppPage,
		editables: WebElement[];

	beforeEach( () => {
		page = new AppPage;
	} );

	describe( 'simple-usage', () => {
		beforeEach( () => {
			page.navigateTo();
		} );

		beforeEach( async () => {
			editables = [ await page.getEditable(), await page.getInlineEditable() ];
		} );

		it( 'should display welcome message', () => {
			expect( page.getParagraphText() ).toEqual( 'CKEditor integration with Angular 2+' );
		} );

		it( 'should display editor with initial content', async () => {
			editables.forEach( editable => expect( page.getHtmlString( editable ) )
				.toBe( '<p>Getting used to an entirely different culture can be challeng' +
					'ing. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural d' +
					'iversity in person. You learn to appreciate each and every single one of the differences while you become more cultura' +
					'lly fluid.</p>' )
			);
		} );

		describe( 'typing', () => {
			it( `in editor1 should update editors content`, testTyping( 0 ) );
			it( `in editor2 should update editors content`, testTyping( 1 ) );

			function testTyping( editableNumber: number ) {
				return async function() {
					const keys = [
						'Foo! ',
						protractor.Key.chord( protractor.Key.CONTROL, 'b' ),
						'Bar?'
					];

					await page.updateValue( editables[ editableNumber ], keys );

					editables.forEach( item => {
						expect( page.getHtmlString( item ) )
							.toBe( '<p>Foo!&nbsp;<strong>Bar?</strong></p>' );
					} );
				};
			}
		} );
	} );
} );
