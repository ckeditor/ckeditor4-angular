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
