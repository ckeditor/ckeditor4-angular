/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { NgZone, EventEmitter, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { CKEditor4 } from './ckeditor';
export declare class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    private elementRef;
    private ngZone;
    /**
     * The configuration of the editor.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
     * to learn more.
     */
    config?: CKEditor4.Config;
    /**
     * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
     *
     * Defaults to 'https://cdn.ckeditor.com/4.16.2/standard-all/ckeditor.js'
     */
    editorUrl: string;
    /**
     * Tag name of the editor component.
     *
     * The default tag is `textarea`.
     */
    tagName: string;
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
    type: CKEditor4.EditorType;
    /**
     * Keeps track of the editor's data.
     *
     * It's also decorated as an input which is useful when not using the ngModel.
     *
     * See https://angular.io/api/forms/NgModel to learn more.
     */
    set data(data: string);
    get data(): string;
    /**
     * When set to `true`, the editor becomes read-only.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
     * to learn more.
     */
    set readOnly(isReadOnly: boolean);
    get readOnly(): boolean;
    /**
     * Fired when the CKEDITOR https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html namespace
     * is loaded. It only triggers once, no matter how many CKEditor 4 components are initialised.
     * Can be used for convenient changes in the namespace, e.g. for adding external plugins.
     */
    namespaceLoaded: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
     * event.
     */
    ready: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the editor data is loaded, e.g. after calling setData()
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
     * editor's method. It corresponds with the `editor#dataReady`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
     */
    dataReady: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the content of the editor has changed. It corresponds with the `editor#change`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
     * event. For performance reasons this event may be called even when data didn't really changed.
     * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
     * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
     */
    change: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the content of the editor has changed. In contrast to `change` - only emits when
     * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
     *
     * See more: https://angular.io/guide/template-syntax#two-way-binding---
     */
    dataChange: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
     * event.
     */
    dragStart: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
     * event.
     */
    dragEnd: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the native drop event occurs. It corresponds with the `editor#drop`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
     * event.
     */
    drop: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
     * event.
     */
    fileUploadResponse: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
     * event.
     */
    fileUploadRequest: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
     * event.
     */
    focus: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires after the user initiated a paste action, but before the data is inserted.
     * It corresponds with the `editor#paste`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
     * event.
     */
    paste: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
     * event.
     */
    afterPaste: EventEmitter<CKEditor4.EventInfo>;
    /**
     * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
     * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
     * event.
     */
    blur: EventEmitter<CKEditor4.EventInfo>;
    /**
     * A callback executed when the content of the editor changes. Part of the
     * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
     *
     * Note: Unset unless the component uses the `ngModel`.
     */
    onChange?: (data: string) => void;
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
    private _readOnly;
    private _data;
    private _destroyed;
    constructor(elementRef: ElementRef, ngZone: NgZone);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    writeValue(value: string): void;
    registerOnChange(callback: (data: string) => void): void;
    registerOnTouched(callback: () => void): void;
    private createEditor;
    private subscribe;
    private propagateChange;
}
