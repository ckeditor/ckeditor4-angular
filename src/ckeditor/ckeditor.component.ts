/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
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

import { CKEditor4 } from './ckeditor';

declare var CKEDITOR: any;

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
	 * By default editor interface will be initialized as an iframe based classic editor.
	 * You can change interface type by choosing between `classic` and `inline` editor interface types.
	 *
	 * See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_uitypes.html
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
		} else {
			this._data = data;
		}
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
		} else {
			// Delay setting read-only state until editor initialization.
			this.initialReadOnly = isReadOnly;
		}
	}

	get readOnly() {
		if ( this.instance ) {
			return this.instance.readOnly;
		}

		return this.initialReadOnly;
	}

	/**
	 * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
	 * event.
	 */
	@Output() ready: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor#change`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
	 * event. For performance reasons this event may be called even when data didn't really changed.
	 */
	@Output() change: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. In contrast to `change` - only emits when
	 * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
	 *
	 * See more: https://angular.io/guide/template-syntax#two-way-binding---
	 */
	@Output() dataChange: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editing view of the editor is focused. It corresponds with the `editor#focus`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
	 * event.
	 */
	@Output() focus: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
	 * event.
	 */
	@Output() blur: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * The instance of the editor created by this component.
	 */
	instance: any;

	/**
	 * Wrapper element used to initialize editor.
	 */
	wrapper: HTMLElement;

	/**
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	initialReadOnly: any = null;

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

	constructor( private elementRef: ElementRef<HTMLElement>, private ngZone: NgZone ) {
	}

	ngAfterViewInit() {
		this.ngZone.runOutsideAngular( this.createEditor.bind( this ) );
	}

	ngOnDestroy() {
		this.ngZone.runOutsideAngular( () => {
			if ( this.instance ) {
				this.instance.destroy();
				this.instance = null;
			}
		} );
	}

	writeValue( value: string | null ): void {
		this.data = value;
	}

	registerOnChange( callback: ( data: string ) => void ): void {
		this.onChange = callback;
	}

	registerOnTouched( callback: () => void ): void {
		this.onTouched = callback;
	}

	private createEditor() {
		if ( typeof CKEDITOR === 'undefined' ) {
			console.error( 'CKEditor4 library could not be found.' +
				' See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_installation.html for installation options.' );

			return;
		}

		const element = this.createInitialElement();

		this.config = this.ensureDivareaPlugin( this.config || {} );

		const instance = this.type === CKEditor4.EditorType.INLINE ?
			CKEDITOR.inline( element, this.config )
			: CKEDITOR.replace( element, this.config );

		instance.once( 'instanceReady', evt => {
			this.instance = instance;

			this.wrapper.removeAttribute( 'style' );

			this.elementRef.nativeElement.appendChild( this.wrapper );

			// Read only state may change during instance initialization.
			this.readOnly = this.initialReadOnly !== null ? this.initialReadOnly : this.instance.readOnly;

			this.subscribe( this.instance );

			if ( this.data !== null ) {
				this.instance.setData( this.data );
			}

			this.ngZone.run( () => {
				this.ready.emit( evt );
			} );
		} );
	}

	private subscribe( editor: any ) {
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

	private ensureDivareaPlugin( config ) {
		let { extraPlugins, removePlugins } = config;

		extraPlugins = this.removePlugin( extraPlugins, 'divarea' ) || '';
		extraPlugins = extraPlugins.concat( this.isString( extraPlugins ) ? ',divarea' : 'divarea' );

		if ( removePlugins && removePlugins.indexOf( 'divarea' ) !== -1 ) {

			removePlugins = this.removePlugin( removePlugins, 'divarea' );

			console.warn( '[CKEDITOR] divarea plugin is required to initialize editor using Angular integration.' );
		}

		return Object.assign( {}, config, { extraPlugins, removePlugins } );
	}

	private removePlugin( plugins, toRemove ){
		if ( !plugins ) {
			return null;
		}

		const isString = this.isString( plugins );

		if ( isString ) {
			plugins = plugins.split( ',' );
		}

		plugins = plugins.filter( plugin => plugin !== toRemove );

		if ( isString ) {
			plugins = plugins.join( ',' );
		}

		return plugins;
	}

	private isString( value ) {
		return typeof value === 'string';
	}

	private createInitialElement() {
		// Render editor outside of component so it won't be removed from DOM before `instanceReady`.
		this.wrapper = document.createElement( 'div' );
		const element = document.createElement( this.tagName );

		this.wrapper.setAttribute( 'style', 'display:none;' );

		document.body.appendChild( this.wrapper );
		this.wrapper.appendChild( element );

		return element;
	}
}
