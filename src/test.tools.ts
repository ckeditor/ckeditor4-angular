export class TestTools {
	static whenEvent( evt, component ) {
		return new Promise( res => {
			component[ evt ].subscribe( res );
		} );
	}
}
