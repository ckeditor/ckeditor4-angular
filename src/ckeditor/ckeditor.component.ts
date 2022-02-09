/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	Component,
	NgZone,
	Input,
	Output,
	EventEmitter,
	forwardRef,
	ElementRef,
	AfterViewInit, OnDestroy
} from '@angular/core';

import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

import { getEditorNamespace } from 'ckeditor4-integrations-common';

import { CKEditor4 } from './ckeditor';

declare let CKEDITOR: any;

@Component( {
	selector: 'ckeditor',
	template: '<ng-template></ng-template>',

	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef( () => CKEditorComponent ),
			multi: true,
		}
	]
} )
export class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
	/**
	 * The configuration of the editor.
	 *
	 * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
	 * to learn more.
	 */
	@Input() config?: CKEditor4.Config;

	/**
	 * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
	 *
	 * Defaults to 'https://cdn.ckeditor.com/4.17.2/standard-all/ckeditor.js'
	 */
	@Input() editorUrl = 'https://cdn.ckeditor.com/4.17.2/standard-all/ckeditor.js';

	/**
	 * Tag name of the editor component.
	 *
	 * The default tag is `textarea`.
	 */
	@Input() tagName = 'textarea';

	/**
	 * The type of the editor interface.
	 *
	 * By default editor interface will be initialized as `classic` editor.
	 * You can also choose to create an editor with `inline` interface type instead.
	 *
	 * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
	 * and https://ckeditor.com/docs/ckeditor4/latest/examples/fixedui.html
	 * to learn more.
	 */
	@Input() type: CKEditor4.EditorType = CKEditor4.EditorType.CLASSIC;

	/**
	 * Keeps track of the editor's data.
	 *
	 * It's also decorated as an input which is useful when not using the ngModel.
	 *
	 * See https://angular.io/api/forms/NgModel to learn more.
	 */
	@Input() set data( data: string ) {
		if ( data === this._data ) {
			return;
		}

		if ( this.instance ) {
			this.instance.setData( data );
			// Data may be changed by ACF.
			this._data = this.instance.getData();
			return;
		}

		this._data = data;
	}

	get data(): string {
		return this._data;
	}

	/**
	 * When set to `true`, the editor becomes read-only.
	 *
	 * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
	 * to learn more.
	 */
	@Input() set readOnly( isReadOnly: boolean ) {
		if ( this.instance ) {
			this.instance.setReadOnly( isReadOnly );
			return;
		}

		// Delay setting read-only state until editor initialization.
		this._readOnly = isReadOnly;
	}

	get readOnly(): boolean {
		if ( this.instance ) {
			return this.instance.readOnly;
		}

		return this._readOnly;
	}

	/**
	 * Fired when the CKEDITOR https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html namespace
	 * is loaded. It only triggers once, no matter how many CKEditor 4 components are initialised.
	 * Can be used for convenient changes in the namespace, e.g. for adding external plugins.
	 */
	@Output() namespaceLoaded = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
	 * event.
	 */
	@Output() ready = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editor data is loaded, e.g. after calling setData()
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
	 * editor's method. It corresponds with the `editor#dataReady`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
	 */
	@Output() dataReady = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor#change`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
	 * event. For performance reasons this event may be called even when data didn't really changed.
	 * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
	 * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
	 */
	@Output() change = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. In contrast to `change` - only emits when
	 * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
	 *
	 * See more: https://angular.io/guide/template-syntax#two-way-binding---
	 */
	@Output() dataChange = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
	 * event.
	 */
	@Output() dragStart = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
	 * event.
	 */
	@Output() dragEnd = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the native drop event occurs. It corresponds with the `editor#drop`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
	 * event.
	 */
	@Output() drop = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
	 * event.
	 */
	@Output() fileUploadResponse = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
	 * event.
	 */
	@Output() fileUploadRequest = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
	 * event.
	 */
	@Output() focus = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires after the user initiated a paste action, but before the data is inserted.
	 * It corresponds with the `editor#paste`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
	 * event.
	 */
	@Output() paste = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
	 * event.
	 */
	@Output() afterPaste = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
	 * event.
	 */
	@Output() blur = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * A callback executed when the content of the editor changes. Part of the
	 * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
	 *
	 * Note: Unset unless the component uses the `ngModel`.
	 */
	onChange?: ( data: string ) => void;

	/**
	 * A callback executed when the editor has been blurred. Part of the
	 * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
	 *
	 * Note: Unset unless the component uses the `ngModel`.
	 */
	onTouched?: () => void;

	/**
	 * The instance of the editor created by this component.
	 */
	instance: any;

	/**
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	private _readOnly: boolean = null;

	private _data: string = null;

	private _destroyed: boolean = false;

	constructor( private elementRef: ElementRef, private ngZone: NgZone ) {}

	ngAfterViewInit(): void {
		getEditorNamespace( this.editorUrl, namespace => {
			this.namespaceLoaded.emit( namespace );
		} ).then( () => {
			// Check if component instance was destroyed before `ngAfterViewInit` call (#110).
			// Here, `this.instance` is still not initialized and so additional flag is needed.
			if ( this._destroyed ) {
				return;
			}

			this.ngZone.runOutsideAngular( this.createEditor.bind( this ) );
		} ).catch( window.console.error );
	}

	ngOnDestroy(): void {
		this._destroyed = true;

		this.ngZone.runOutsideAngular( () => {
			if ( this.instance ) {
				this.instance.destroy();
				this.instance = null;
			}
		} );
	}

	writeValue( value: string ): void {
		this.data = value;
	}

	registerOnChange( callback: ( data: string ) => void ): void {
		this.onChange = callback;
	}

	registerOnTouched( callback: () => void ): void {
		this.onTouched = callback;
	}

	private createEditor(): void {
		const element = document.createElement( this.tagName );
		this.elementRef.nativeElement.appendChild( element );

		const userInstanceReadyCallback = this.config?.on?.instanceReady;
		const defaultConfig: Partial<CKEditor4.Config> = {
			delayIfDetached: true
		};
		const config: Partial<CKEditor4.Config> = { ...defaultConfig, ...this.config };

		if ( typeof config.on === 'undefined' ) {
			config.on = {};
		}

		config.on.instanceReady = evt => {
			const editor = evt.editor;

			this.instance = editor;

			// Read only state may change during instance initialization.
			this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;

			this.subscribe( this.instance );

			const undo = editor.undoManager;

			if ( this.data !== null ) {
				undo && undo.lock();

				editor.setData( this.data, { callback: () => {
					// Locking undoManager prevents 'change' event.
					// Trigger it manually to updated bound data.
					if ( this.data !== editor.getData() ) {
						undo ? editor.fire( 'change' ) : editor.fire( 'dataReady' );
					}
					undo && undo.unlock();

					this.ngZone.run( () => {
						if ( typeof userInstanceReadyCallback === 'function' ) {
							userInstanceReadyCallback( evt );
						}

						this.ready.emit( evt );
					} );
				} } );
			} else {
				this.ngZone.run( () => {
					if ( typeof userInstanceReadyCallback === 'function' ) {
						userInstanceReadyCallback( evt );
					}

					this.ready.emit( evt );
				} );
			}
		}

		if ( this.type === CKEditor4.EditorType.INLINE ) {
			CKEDITOR.inline( element, config );
		} else {
			CKEDITOR.replace( element, config );
		}
	}

	private subscribe( editor: any ): void {
		editor.on( 'focus', evt => {
			this.ngZone.run( () => {
				this.focus.emit( evt );
			} );
		} );

		editor.on( 'paste', evt => {
			this.ngZone.run( () => {
				this.paste.emit( evt );
			} );
		} );

		editor.on( 'afterPaste', evt => {
			this.ngZone.run( () => {
				this.afterPaste.emit( evt );
			} );
		} );

		editor.on( 'dragend', evt => {
			this.ngZone.run( () => {
				this.dragEnd.emit( evt );
			} );
		});

		editor.on( 'dragstart', evt => {
			this.ngZone.run( () => {
				this.dragStart.emit( evt );
			} );
		} );

		editor.on( 'drop', evt => {
			this.ngZone.run( () => {
				this.drop.emit( evt );
			} );
		} );

		editor.on( 'fileUploadRequest', evt => {
			this.ngZone.run( () => {
				this.fileUploadRequest.emit(evt);
			} );
		} );

		editor.on( 'fileUploadResponse', evt => {
			this.ngZone.run( () => {
				this.fileUploadResponse.emit(evt);
			} );
		} );

		editor.on( 'blur', evt => {
			this.ngZone.run( () => {
				if ( this.onTouched ) {
					this.onTouched();
				}

				this.blur.emit( evt );
			} );
		} );

		editor.on( 'dataReady', this.propagateChange, this );

		if ( this.instance.undoManager ) {
			editor.on( 'change', this.propagateChange, this );
		}
		// If 'undo' plugin is not loaded, listen to 'selectionCheck' event instead. (#54).
		else {
			editor.on( 'selectionCheck', this.propagateChange, this );
		}
	}

	private propagateChange( event: any ): void {
		this.ngZone.run( () => {
			const newData = this.instance.getData();

			if ( event.name === 'change' ) {
				this.change.emit( event );
			} else if ( event.name === 'dataReady' ) {
				this.dataReady.emit( event );
			}

			if ( newData === this.data ) {
				return;
			}

			this._data = newData;
			this.dataChange.emit( newData );

			if ( this.onChange ) {
				this.onChange( newData );
			}
		} );
	}

}
