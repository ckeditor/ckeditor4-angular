import { CKEditorComponent } from './ckeditor/ckeditor.component';

export class TestTools {
	static whenEvent( evtName: string, component: CKEditorComponent ) {
		return new Promise( res => {
			component[ evtName ].subscribe( res );
		} );
	}
}
