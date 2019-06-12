/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
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

import { getEditorNamespace } from './ckeditor.helpers';

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
	 * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
	 * to learn more.
	 */
	@Input() config?: CKEditor4.Config;

	/**
	 * Tag name of the editor component.
	 *
	 * The default tag is `textarea`.
	 */
	@Input() tagName = 'textarea';

	/**
	 * The type of the editor interface.
	 *
	 * By default editor interface will be initialized as `divarea` editor which is an inline editor with fixed UI.
	 * You can change interface type by choosing between `divarea` and `inline` editor interface types.
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
	 * When set `true`, the editor becomes read-only.
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
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
	 * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
	 * event.
	 */
	@Output() ready = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor#change`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
	 * event. For performance reasons this event may be called even when data didn't really changed.
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
	 * Fires when the editing view of the editor is focused. It corresponds with the `editor#focus`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
	 * event.
	 */
	@Output() focus = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
	 * event.
	 */
	@Output() blur = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * The instance of the editor created by this component.
	 */
	instance: any;

	/**
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	private _readOnly: boolean = null;

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

	private _data: string = null;

	/**
	 * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
	 *
	 * Defaults to 'https://cdn.ckeditor.com/4.13.0/standard-all/ckeditor.js'
	 */
	@Input() editorUrl = 'https://cdn.ckeditor.com/4.13.0/standard-all/ckeditor.js';

	constructor( private elementRef: ElementRef, private ngZone: NgZone ) {
	}

	ngAfterViewInit(): void {
		getEditorNamespace( this.editorUrl ).then( () => {
			this.ngZone.runOutsideAngular( this.createEditor.bind( this ) );
		} ).catch( window.console.error );
	}

	ngOnDestroy(): void {
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

		if ( this.type === CKEditor4.EditorType.DIVAREA ) {
			this.config = this.ensureDivareaPlugin( this.config || {} );
		}

		const instance: CKEditor4.Editor = this.type === CKEditor4.EditorType.INLINE
			? CKEDITOR.inline( element, this.config )
			: CKEDITOR.replace( element, this.config );

		instance.once( 'instanceReady', ( evt ) => {
			this.instance = instance;

			// Read only state may change during instance initialization.
			this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;

			this.subscribe( this.instance );

			const undo = instance.undoManager;

			if ( this.data !== null ) {
				undo && undo.lock();

				instance.setData( this.data, { callback: () => {
					// Locking undoManager prevents 'change' event.
					// Trigger it manually to updated bound data.
					if ( this.data !== instance.getData() ) {
						instance.fire( 'change' );
					}
					undo && undo.unlock();

					this.ngZone.run( () => {
						this.ready.emit( evt );
					} );
				} } );
			} else {
				this.ngZone.run( () => {
					this.ready.emit( evt );
				} );
			}
		} );
	}

	private subscribe( editor: any ): void {
		editor.on( 'focus', evt => {
			this.ngZone.run( () => {
				this.focus.emit( evt );
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

		editor.on( 'change', evt => {
			this.ngZone.run( () => {
				const newData = editor.getData();

				this.change.emit( evt );

				if ( newData === this.data ) {
					return;
				}

				this._data = newData;
				this.dataChange.emit( newData );

				if ( this.onChange ) {
					this.onChange( newData );
				}
			} );
		} );
	}

	private ensureDivareaPlugin( config: CKEditor4.Config ): CKEditor4.Config {
		let { extraPlugins, removePlugins } = config;

		extraPlugins = this.removePlugin( extraPlugins, 'divarea' ) || '';
		extraPlugins = extraPlugins.concat( typeof extraPlugins === 'string' ? ',divarea' : 'divarea' );

		if ( removePlugins && removePlugins.includes( 'divarea' ) ) {

			removePlugins = this.removePlugin( removePlugins, 'divarea' );

			console.warn( '[CKEDITOR] divarea plugin is required to initialize editor using Angular integration.' );
		}

		return Object.assign( {}, config, { extraPlugins, removePlugins } );
	}

	private removePlugin( plugins: string | string[], toRemove: string ): string | string[] {
		if ( !plugins ) {
			return null;
		}

		const isString = typeof plugins === 'string';

		if ( isString ) {
			plugins = ( plugins as string ).split( ',' );
		}

		plugins = ( plugins as string[] ).filter( plugin => plugin !== toRemove );

		if ( isString ) {
			plugins = ( plugins as string[] ).join( ',' );
		}

		return plugins;
	}
}
