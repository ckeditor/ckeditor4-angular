/**
 * Basic typings for the CKEditor4 elements.
 */
export namespace CKEditor4 {

	/**
	 * The CKEditor4 editor constructor.
	 */
	export interface Config {
		[ key: string ]: any;
	}

	/**
	 * The CKEditor4 editor interface type.
	 * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
	 * to learn more.
	 */
	export enum EditorType {
		CLASSIC = 'classic',
		INLINE = 'inline'
	}

	/**
	 * The event object passed to CKEditor4 event callbacks.
	 *
	 * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_eventInfo.html
	 * to learn more.
	 */
	export interface EventInfo {
		readonly name: string;
		readonly editor: any;
		readonly data: object;
		readonly listenerData: object;
		readonly sender: object;

		cancel(): void;

		removeListener(): void;

		stop(): void;
	}
}
