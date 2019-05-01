import { CKEditorComponent } from './ckeditor/ckeditor.component';

export function whenEvent( evtName: string, component: CKEditorComponent ) {
	return new Promise( res => {
		component[ evtName ].subscribe( res );
	} );
}

export function whenDataReady( editor: any, callback?: Function ) {
	return new Promise( res => {
		editor.once( 'dataReady', () => {
			res();
		}, null, null, 9999 );

		callback && callback();
	} );
}

export function setDataMultipleTimes( editor: any, data: Array<string> ) {
	return new Promise( res => {
		if ( !editor.editable().isInline() ) {
			// Due to setData() issue with iframe based editor, subsequent setData() calls
			// should be performed asynchronously (https://github.com/ckeditor/ckeditor4/issues/3669).
			setDataHelper( editor, data, res );
		} else {
			data.forEach( content => editor.setData( content ) );
			res();
		}
	} );
}

function setDataHelper( editor: any, data: Array<string>, done: Function ) {
	if ( data.length ) {
		const content: string = data.shift();

		setTimeout( () => {
			editor.setData( content );
			setDataHelper( editor, data, done );
		}, 100 );
	} else {
		setTimeout( done, 100 );
	}
}

declare var CKEDITOR: any;

export class TestTools {
	static whenEvent( evtName: string, component: CKEditorComponent ) {
		return new Promise( res => {
			component[ evtName ].subscribe( res );
		} );
	}

	static mockNativeDataTransfer() {
		return {
			types: [],
			files: CKEDITOR.env.ie && CKEDITOR.env.version < 10 ? undefined : [],
			_data: {},
			// Emulate browsers native behavior for getData/setData.
			setData: function( type, data ) {
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 16 && type != 'Text' && type != 'URL' ) {
					throw 'Unexpected call to method or property access.';
				}

				if ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 && type == 'URL' ) {
					return;
				}

				// While Edge 16+ supports Clipboard API, it does not support custom mime types
				// in `setData` and throws `Element not found.` if such are used.
				if ( CKEDITOR.env.edge && CKEDITOR.env.version >= 16 &&
					CKEDITOR.tools.indexOf(
						[ 'Text', 'URL', 'text/plain', 'text/html', 'application/xml' ],
						type
					) === -1) {

					throw {
						name: 'Error',
						message: 'Element not found.'
					};
				}

				if ( type == 'text/plain' || type == 'Text' ) {
					this._data[ 'text/plain' ] = data;
					this._data.Text = data;
				} else {
					this._data[ type ] = data;
				}

				this.types.push( type );
			},
			getData: function( type ) {
				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 16 && type != 'Text' && type != 'URL' ) {
					throw 'Invalid argument.';
				}

				if ( typeof this._data[ type ] === 'undefined' || this._data[ type ] === null ) {
					return '';
				}

				return this._data[ type ];
			},
			clearData: function( type ) {
				var index = CKEDITOR.tools.indexOf( this.types, type );

				if ( index !== -1 ) {
					delete this._data[ type ];
					this.types.splice( index, 1 );
				}
			}
		};
	}

	static mockPasteEvent() {
		const dataTransfer = TestTools.mockNativeDataTransfer()
		let target = new CKEDITOR.dom.node('targetMock')

		return {
			$: {
				ctrlKey: true,
				clipboardData: ( CKEDITOR.env.ie && CKEDITOR.env.version < 16 )
					? undefined
					: dataTransfer
			},
			preventDefault: function() {
				// noop
			},
			getTarget: function() {
				return target;
			},
			setTarget: function( t: any ) {
				target = t;
			}
		};
	}
}
