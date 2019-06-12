import { CKEditorComponent } from './ckeditor/ckeditor.component';

export function whenEvent( evtName: string, component: CKEditorComponent ) {
	return new Promise( res => {
		component[ evtName ].subscribe( res );
	} );
}

export function whenDataReady( editor: any ) {
	return new Promise( res => {
		editor.once( 'dataReady', () => {
			res();
		}, null, null, 9999 );
	} );
}
