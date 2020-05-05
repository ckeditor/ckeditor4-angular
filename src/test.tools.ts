import { CKEditorComponent } from './ckeditor/ckeditor.component';

declare var CKEDITOR: any;

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

export function mockPasteEvent() {
	const dataTransfer = mockNativeDataTransfer();
	let target = new CKEDITOR.dom.element( 'div' );

	return {
		$: {
			ctrlKey: true,
			clipboardData: ( CKEDITOR.env.ie && CKEDITOR.env.version < 16 ) ? undefined : dataTransfer
		},
		preventDefault: function() {},
		getTarget: function() {
			return target;
		},
		setTarget: function( t: any ) {
			target = t;
		}
	};
}

export function mockDropEvent() {
	const dataTransfer = mockNativeDataTransfer();
	let target = new CKEDITOR.dom.element( 'div' );

	target.isReadOnly = function() {
		return false;
	};

	return {
		$: {
			dataTransfer: dataTransfer
		},
		preventDefault: function() {},
		getTarget: function() {
			return target;
		},
		setTarget: function( t: any ) {
			target = t;
		}
	};
}

export function fireDragEvent( eventName: string, editor: any, evt: any ) {
	const dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );

	dropTarget.fire( eventName, evt );
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

function mockNativeDataTransfer() {
	return {
		types: [],
		files: [],
		_data: {},
		setData: function( type, data ) {
			if ( type == 'text/plain' || type == 'Text' ) {
				this._data[ 'text/plain' ] = data;
				this._data.Text = data;
			} else {
				this._data[ type ] = data;
			}

			this.types.push( type );
		},
		getData: function( type ) {
			return this._data[ type ];
		},
		clearData: function( type ) {
			const index = CKEDITOR.tools.indexOf( this.types, type );

			if ( index !== -1 ) {
				delete this._data[ type ];
				this.types.splice( index, 1 );
			}
		}
	};
}
