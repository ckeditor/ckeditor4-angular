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
	 * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
	 * event.
	 */
	@Output() ready: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor#change`
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
	 * event.
	 */
	@Output() change: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

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
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	initialDisabled: any = null;

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

	private _data: string;

	/**
	 * Keeps track of the editor's data.
	 *
	 * It's also decorated as an input which is useful when not using the ngModel.
	 *
	 * Store actual data in private _data property and use setter to update data,
	 * to allow `(data)` binding.
	 *
	 * See https://angular.io/api/forms/NgModel to learn more.
	 */
	@Input() set data( data: string ) {
		this.updateData( data );
	}

	/**
	 * Emit `dataChange` event to allow `[data]` binding and two way `[(data)]` binding.
	 *
	 * See more: https://angular.io/guide/template-syntax#two-way-binding---
	 */
	@Output() dataChange: EventEmitter<CKEditor4.EventInfo> = new EventEmitter<CKEditor4.EventInfo>();

	get data(): string {
		return this._data;
	}

	/**
	 * When set `true`, the editor becomes read-only.
	 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
	 * to learn more.
	 */
	@Input() set disabled( isDisabled: boolean ) {
		if ( this.instance ) {
			this.instance.setReadOnly( isDisabled );
		} else {
			// Delay setting read-only state until editor initialization.
			this.initialDisabled = isDisabled;
		}
	}

	get disabled() {
		if ( this.instance ) {
			return this.instance.readOnly;
		}

		return this.initialDisabled;
	}

	constructor( private elementRef: ElementRef<HTMLElement>, private ngZone: NgZone ) {}

	ngAfterViewInit() {
		this.ngZone.runOutsideAngular( this.createEditor.bind( this ) );
	}

	ngOnDestroy() {
		if ( this.instance ) {
			setTimeout( () => {
				this.instance.destroy();
				this.instance = null;
			} );
		}
	}

	writeValue( value: string | null ): void {
		// This method is called with the `null` value when the form resets.
		// A component's responsibility is to restore it to the initial state.
		// Known issue, that writeValue is fired twice, first with empty data,
		// then with actual initial data: https://github.com/angular/angular/issues/14988
		if ( value === null ) {
			value = '';
		}

		this.data = value;
	}

	registerOnChange( callback: ( data: string ) => void ): void {
		this.onChange = callback;
	}

	registerOnTouched( callback: () => void ): void {
		this.onTouched = callback;
	}

	setDisabledState( isDisabled: boolean ): void {
		this.disabled = isDisabled;
	}

	private createEditor() {
		if ( typeof CKEDITOR === 'undefined' ) {
			console.error( 'CKEditor4 library could not be found.' +
				' See https://ckeditor.com/docs/ckeditor4/latest/guide/dev_installation.html for installation options.' );

			return;
		}

		const element = document.createElement( this.tagName );

		// Param `data` is correctly set before `ngAfterViewInit`, so we can create editor with initial data.
		// However ControlValueAccessor with ngModel value, calls `writeValue` asynchronously after `ngAfterViewInit`.
		// Delay editor creation, so it's always invoked with initial data.
		setTimeout( () => {

			element.innerHTML = this.data || '';

			this.elementRef.nativeElement.appendChild( element );

			const instance = this.type === CKEditor4.EditorType.INLINE ?
				CKEDITOR.inline( element, this.config )
				: CKEDITOR.replace( element, this.config );

			instance.once( 'instanceReady', evt => {
				this.instance = instance;

				// Read only state may change during instance initialization, restore it here.
				if ( this.initialDisabled !== null ) {
					this.disabled = this.initialDisabled;
				}

				this.subscribe( this.instance );

				this.ngZone.run( () => {
					this.ready.emit( evt );
				} );
			} );
		} );
	}

	private updateData( value ) {
		if ( this.instance ) {
			this.instance.setData( value );
			// Data may be changed by ACF.
			this._data = this.instance.getData();
		} else {
			this._data = value;
		}
	}

	private getData() {
		if ( this.instance ) {
			return this.instance.getData();
		}
		return this.data;
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
			const newData = editor.getData();

			this.ngZone.run( () => {
				// Make sure that data really changed due to `editor#change`
				// (https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change)
				// event limitation which may be called even when data didn't change.
				if ( this.onChange && this._data !== newData ) {
					this.onChange( newData );
				}

				this._data = newData;
				this.change.emit( evt );
				this.dataChange.emit( newData );
			} );
		} );
	}
}
