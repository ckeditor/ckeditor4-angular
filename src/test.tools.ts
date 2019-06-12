import { CKEditorComponent } from './ckeditor/ckeditor.component';

export function whenEvent( evtName: string, component: CKEditorComponent ) {
	return new Promise( res => {
		component[ evtName ].subscribe( res );
	} );
}
