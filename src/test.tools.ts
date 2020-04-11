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

export function whenDataPasted( editor: any, skipCancel = false) {
	return new Promise( res => {
		editor.once( 'paste', evt => {
			evt.removeListener();

			if ( !skipCancel ) {
				evt.cancel(); // Cancel for performance reason - we don't need insertion happen.
			}

			res();
		}, null, null, 9999 );
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

export function mockNativeDataTransfer() {
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

export function mockPasteEvent() {
	const dataTransfer = mockNativeDataTransfer()
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

export function mockDropEvent() {
	var dataTransfer = this.mockNativeDataTransfer();
	var target = new CKEDITOR.dom.text( 'targetMock' );

	target.isReadOnly = function() {
		return false;
	};

	return {
		$: {
			dataTransfer: dataTransfer
		},
		preventDefault: function() {
			// noop
		},
		getTarget: function() {
			return target;
		},
		setTarget: function( t ) {
			target = t;
		}
	};
}

export function fireDragStartEvent( editor: any, evt: any, widgetOrNode: any ) {
	const dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor );
	const dragTarget = getDragEventTarget( widgetOrNode );

	// Use realistic target which is the drag handler or the element.
	evt.setTarget( dragTarget );

	dropTarget.fire( 'dragstart', evt );
}

export function getWidgetById( editor: any, id: string, byElement = false ) {
	var widget = editor.widgets.getByElement( editor.document.getById( id ) );

	if ( widget && byElement ) {
		return widget.element.$.id == id ? widget : null;
	}

	return widget;
}

export function fireDropEvent( editor: any, evt: any, dropRange: any ) {
	const dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;

	// If drop range is known use a realistic target. If no, then use a mock.
	if ( dropRange ) {
		evt.setTarget( dropRange.startContainer );
	} else {
		evt.setTarget( new CKEDITOR.dom.text( 'targetMock' ) );
	}

	dropTarget.fire( 'drop', evt );
}

export function fireDragEndEvent( editor: any, evt: any, widgetOrNode: any ) {
	const dropTarget = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? editor.editable() : editor.document;
	const dragTarget = getDragEventTarget( widgetOrNode );

	// Use realistic target which is the drag handler or the element.
	evt.setTarget( dragTarget );

	dropTarget.fire( 'dragend', evt );
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

function getDragEventTarget( widgetOrNode ) {
	if ( !widgetOrNode.dragHandlerContainer ) {
		return widgetOrNode;
	}

	return widgetOrNode.dragHandlerContainer.findOne( 'img' );
}
