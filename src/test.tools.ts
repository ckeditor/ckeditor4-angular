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
