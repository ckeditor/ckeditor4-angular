/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
import * as i0 from "@angular/core";
export class CKEditorComponent {
    constructor(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        /**
         * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
         *
         * Defaults to 'https://cdn.ckeditor.com/4.22.1/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.22.1/standard-all/ckeditor.js';
        /**
         * Tag name of the editor component.
         *
         * The default tag is `textarea`.
         */
        this.tagName = 'textarea';
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
        this.type = "classic" /* CLASSIC */;
        /**
         * Fired when the CKEDITOR https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html namespace
         * is loaded. It only triggers once, no matter how many CKEditor 4 components are initialised.
         * Can be used for convenient changes in the namespace, e.g. for adding external plugins.
         */
        this.namespaceLoaded = new EventEmitter();
        /**
         * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
         * event.
         */
        this.ready = new EventEmitter();
        /**
         * Fires when the editor data is loaded, e.g. after calling setData()
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
         * editor's method. It corresponds with the `editor#dataReady`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
         */
        this.dataReady = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. It corresponds with the `editor#change`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
         * event. For performance reasons this event may be called even when data didn't really changed.
         * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
         * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
         */
        this.change = new EventEmitter();
        /**
         * Fires when the content of the editor has changed. In contrast to `change` - only emits when
         * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
         *
         * See more: https://angular.io/guide/template-syntax#two-way-binding---
         */
        this.dataChange = new EventEmitter();
        /**
         * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
         * event.
         */
        this.dragStart = new EventEmitter();
        /**
         * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
         * event.
         */
        this.dragEnd = new EventEmitter();
        /**
         * Fires when the native drop event occurs. It corresponds with the `editor#drop`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
         * event.
         */
        this.drop = new EventEmitter();
        /**
         * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
         * event.
         */
        this.fileUploadResponse = new EventEmitter();
        /**
         * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
         * event.
         */
        this.fileUploadRequest = new EventEmitter();
        /**
         * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
         * event.
         */
        this.focus = new EventEmitter();
        /**
         * Fires after the user initiated a paste action, but before the data is inserted.
         * It corresponds with the `editor#paste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
         * event.
         */
        this.paste = new EventEmitter();
        /**
         * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
         * event.
         */
        this.afterPaste = new EventEmitter();
        /**
         * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
         * event.
         */
        this.blur = new EventEmitter();
        /**
         * If the component is read–only before the editor instance is created, it remembers that state,
         * so the editor can become read–only once it is ready.
         */
        this._readOnly = null;
        this._data = null;
        this._destroyed = false;
    }
    /**
     * Keeps track of the editor's data.
     *
     * It's also decorated as an input which is useful when not using the ngModel.
     *
     * See https://angular.io/api/forms/NgModel to learn more.
     */
    set data(data) {
        if (data === this._data) {
            return;
        }
        if (this.instance) {
            this.instance.setData(data);
            // Data may be changed by ACF.
            this._data = this.instance.getData();
            return;
        }
        this._data = data;
    }
    get data() {
        return this._data;
    }
    /**
     * When set to `true`, the editor becomes read-only.
     *
     * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
     * to learn more.
     */
    set readOnly(isReadOnly) {
        if (this.instance) {
            this.instance.setReadOnly(isReadOnly);
            return;
        }
        // Delay setting read-only state until editor initialization.
        this._readOnly = isReadOnly;
    }
    get readOnly() {
        if (this.instance) {
            return this.instance.readOnly;
        }
        return this._readOnly;
    }
    ngAfterViewInit() {
        getEditorNamespace(this.editorUrl, namespace => {
            this.namespaceLoaded.emit(namespace);
        }).then(() => {
            // Check if component instance was destroyed before `ngAfterViewInit` call (#110).
            // Here, `this.instance` is still not initialized and so additional flag is needed.
            if (this._destroyed) {
                return;
            }
            this.ngZone.runOutsideAngular(this.createEditor.bind(this));
        }).catch(window.console.error);
    }
    ngOnDestroy() {
        this._destroyed = true;
        this.ngZone.runOutsideAngular(() => {
            if (this.instance) {
                this.instance.destroy();
                this.instance = null;
            }
        });
    }
    writeValue(value) {
        this.data = value;
    }
    registerOnChange(callback) {
        this.onChange = callback;
    }
    registerOnTouched(callback) {
        this.onTouched = callback;
    }
    createEditor() {
        const element = document.createElement(this.tagName);
        this.elementRef.nativeElement.appendChild(element);
        const userInstanceReadyCallback = this.config?.on?.instanceReady;
        const defaultConfig = {
            delayIfDetached: true
        };
        const config = { ...defaultConfig, ...this.config };
        if (typeof config.on === 'undefined') {
            config.on = {};
        }
        config.on.instanceReady = evt => {
            const editor = evt.editor;
            this.instance = editor;
            // Read only state may change during instance initialization.
            this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;
            this.subscribe(this.instance);
            const undo = editor.undoManager;
            if (this.data !== null) {
                undo && undo.lock();
                editor.setData(this.data, { callback: () => {
                        // Locking undoManager prevents 'change' event.
                        // Trigger it manually to updated bound data.
                        if (this.data !== editor.getData()) {
                            undo ? editor.fire('change') : editor.fire('dataReady');
                        }
                        undo && undo.unlock();
                        this.ngZone.run(() => {
                            if (typeof userInstanceReadyCallback === 'function') {
                                userInstanceReadyCallback(evt);
                            }
                            this.ready.emit(evt);
                        });
                    } });
            }
            else {
                this.ngZone.run(() => {
                    if (typeof userInstanceReadyCallback === 'function') {
                        userInstanceReadyCallback(evt);
                    }
                    this.ready.emit(evt);
                });
            }
        };
        if (this.type === "inline" /* INLINE */) {
            CKEDITOR.inline(element, config);
        }
        else {
            CKEDITOR.replace(element, config);
        }
    }
    subscribe(editor) {
        editor.on('focus', evt => {
            this.ngZone.run(() => {
                this.focus.emit(evt);
            });
        });
        editor.on('paste', evt => {
            this.ngZone.run(() => {
                this.paste.emit(evt);
            });
        });
        editor.on('afterPaste', evt => {
            this.ngZone.run(() => {
                this.afterPaste.emit(evt);
            });
        });
        editor.on('dragend', evt => {
            this.ngZone.run(() => {
                this.dragEnd.emit(evt);
            });
        });
        editor.on('dragstart', evt => {
            this.ngZone.run(() => {
                this.dragStart.emit(evt);
            });
        });
        editor.on('drop', evt => {
            this.ngZone.run(() => {
                this.drop.emit(evt);
            });
        });
        editor.on('fileUploadRequest', evt => {
            this.ngZone.run(() => {
                this.fileUploadRequest.emit(evt);
            });
        });
        editor.on('fileUploadResponse', evt => {
            this.ngZone.run(() => {
                this.fileUploadResponse.emit(evt);
            });
        });
        editor.on('blur', evt => {
            this.ngZone.run(() => {
                if (this.onTouched) {
                    this.onTouched();
                }
                this.blur.emit(evt);
            });
        });
        editor.on('dataReady', this.propagateChange, this);
        if (this.instance.undoManager) {
            editor.on('change', this.propagateChange, this);
        }
        // If 'undo' plugin is not loaded, listen to 'selectionCheck' event instead. (#54).
        else {
            editor.on('selectionCheck', this.propagateChange, this);
        }
    }
    propagateChange(event) {
        this.ngZone.run(() => {
            const newData = this.instance.getData();
            if (event.name === 'change') {
                this.change.emit(event);
            }
            else if (event.name === 'dataReady') {
                this.dataReady.emit(event);
            }
            if (newData === this.data) {
                return;
            }
            this._data = newData;
            this.dataChange.emit(newData);
            if (this.onChange) {
                this.onChange(newData);
            }
        });
    }
}
CKEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
CKEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.4.0", type: CKEditorComponent, selector: "ckeditor", inputs: { config: "config", editorUrl: "editorUrl", tagName: "tagName", type: "type", data: "data", readOnly: "readOnly" }, outputs: { namespaceLoaded: "namespaceLoaded", ready: "ready", dataReady: "dataReady", change: "change", dataChange: "dataChange", dragStart: "dragStart", dragEnd: "dragEnd", drop: "drop", fileUploadResponse: "fileUploadResponse", fileUploadRequest: "fileUploadRequest", focus: "focus", paste: "paste", afterPaste: "afterPaste", blur: "blur" }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CKEditorComponent),
            multi: true,
        }
    ], ngImport: i0, template: '<ng-template></ng-template>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CKEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ckeditor',
                    template: '<ng-template></ng-template>',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CKEditorComponent),
                            multi: true,
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { config: [{
                type: Input
            }], editorUrl: [{
                type: Input
            }], tagName: [{
                type: Input
            }], type: [{
                type: Input
            }], data: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], namespaceLoaded: [{
                type: Output
            }], ready: [{
                type: Output
            }], dataReady: [{
                type: Output
            }], change: [{
                type: Output
            }], dataChange: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], dragEnd: [{
                type: Output
            }], drop: [{
                type: Output
            }], fileUploadResponse: [{
                type: Output
            }], fileUploadRequest: [{
                type: Output
            }], focus: [{
                type: Output
            }], paste: [{
                type: Output
            }], afterPaste: [{
                type: Output
            }], blur: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFHVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBRU4saUJBQWlCLEVBQ2pCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBa0JuRSxNQUFNLE9BQU8saUJBQWlCO0lBMk43QixZQUFxQixVQUFzQixFQUFVLE1BQWM7UUFBOUMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFsTm5FOzs7O1dBSUc7UUFDTSxjQUFTLEdBQUcsMERBQTBELENBQUM7UUFFaEY7Ozs7V0FJRztRQUNNLFlBQU8sR0FBRyxVQUFVLENBQUM7UUFFOUI7Ozs7Ozs7OztXQVNHO1FBQ00sU0FBSSwyQkFBc0Q7UUFvRG5FOzs7O1dBSUc7UUFDTyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRXBFOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFMUQ7Ozs7O1dBS0c7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7OztXQU1HO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTNEOzs7OztXQUtHO1FBQ08sZUFBVSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRS9EOzs7O1dBSUc7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFOUQ7Ozs7V0FJRztRQUNPLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztR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QkFBZCxNQUFNO2dCQVFHLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxVQUFVO3NCQUFuQixNQUFNO2dCQU9HLElBQUk7c0JBQWIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjMsIENLU291cmNlIEhvbGRpbmcgc3AuIHogby5vLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogRm9yIGxpY2Vuc2luZywgc2VlIExJQ0VOU0UubWQuXG4gKi9cblxuaW1wb3J0IHtcblx0Q29tcG9uZW50LFxuXHROZ1pvbmUsXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdEV2ZW50RW1pdHRlcixcblx0Zm9yd2FyZFJlZixcblx0RWxlbWVudFJlZixcblx0QWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuXHRDb250cm9sVmFsdWVBY2Nlc3Nvcixcblx0TkdfVkFMVUVfQUNDRVNTT1Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBnZXRFZGl0b3JOYW1lc3BhY2UgfSBmcm9tICdja2VkaXRvcjQtaW50ZWdyYXRpb25zLWNvbW1vbic7XG5cbmltcG9ydCB7IENLRWRpdG9yNCB9IGZyb20gJy4vY2tlZGl0b3InO1xuXG5kZWNsYXJlIGxldCBDS0VESVRPUjogYW55O1xuXG5AQ29tcG9uZW50KCB7XG5cdHNlbGVjdG9yOiAnY2tlZGl0b3InLFxuXHR0ZW1wbGF0ZTogJzxuZy10ZW1wbGF0ZT48L25nLXRlbXBsYXRlPicsXG5cblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZiggKCkgPT4gQ0tFZGl0b3JDb21wb25lbnQgKSxcblx0XHRcdG11bHRpOiB0cnVlLFxuXHRcdH1cblx0XVxufSApXG5leHBvcnQgY2xhc3MgQ0tFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblx0LyoqXG5cdCAqIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBlZGl0b3IuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2NvbmZpZy5odG1sXG5cdCAqIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSBjb25maWc/OiBDS0VkaXRvcjQuQ29uZmlnO1xuXG5cdC8qKlxuXHQgKiBDS0VkaXRvciA0IHNjcmlwdCB1cmwgYWRkcmVzcy4gU2NyaXB0IHdpbGwgYmUgbG9hZGVkIG9ubHkgaWYgQ0tFRElUT1IgbmFtZXNwYWNlIGlzIG1pc3NpbmcuXG5cdCAqXG5cdCAqIERlZmF1bHRzIHRvICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4yMi4xL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcydcblx0ICovXG5cdEBJbnB1dCgpIGVkaXRvclVybCA9ICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4yMi4xL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcyc7XG5cblx0LyoqXG5cdCAqIFRhZyBuYW1lIG9mIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCB0YWcgaXMgYHRleHRhcmVhYC5cblx0ICovXG5cdEBJbnB1dCgpIHRhZ05hbWUgPSAndGV4dGFyZWEnO1xuXG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZWRpdG9yIGludGVyZmFjZS5cblx0ICpcblx0ICogQnkgZGVmYXVsdCBlZGl0b3IgaW50ZXJmYWNlIHdpbGwgYmUgaW5pdGlhbGl6ZWQgYXMgYGNsYXNzaWNgIGVkaXRvci5cblx0ICogWW91IGNhbiBhbHNvIGNob29zZSB0byBjcmVhdGUgYW4gZWRpdG9yIHdpdGggYGlubGluZWAgaW50ZXJmYWNlIHR5cGUgaW5zdGVhZC5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9ndWlkZS9kZXZfdWl0eXBlcy5odG1sXG5cdCAqIGFuZCBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZXhhbXBsZXMvZml4ZWR1aS5odG1sXG5cdCAqIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSB0eXBlOiBDS0VkaXRvcjQuRWRpdG9yVHlwZSA9IENLRWRpdG9yNC5FZGl0b3JUeXBlLkNMQVNTSUM7XG5cblx0LyoqXG5cdCAqIEtlZXBzIHRyYWNrIG9mIHRoZSBlZGl0b3IncyBkYXRhLlxuXHQgKlxuXHQgKiBJdCdzIGFsc28gZGVjb3JhdGVkIGFzIGFuIGlucHV0IHdoaWNoIGlzIHVzZWZ1bCB3aGVuIG5vdCB1c2luZyB0aGUgbmdNb2RlbC5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvTmdNb2RlbCB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IGRhdGEoIGRhdGE6IHN0cmluZyApIHtcblx0XHRpZiAoIGRhdGEgPT09IHRoaXMuX2RhdGEgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0dGhpcy5pbnN0YW5jZS5zZXREYXRhKCBkYXRhICk7XG5cdFx0XHQvLyBEYXRhIG1heSBiZSBjaGFuZ2VkIGJ5IEFDRi5cblx0XHRcdHRoaXMuX2RhdGEgPSB0aGlzLmluc3RhbmNlLmdldERhdGEoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9kYXRhID0gZGF0YTtcblx0fVxuXG5cdGdldCBkYXRhKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGE7XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgZWRpdG9yIGJlY29tZXMgcmVhZC1vbmx5LlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNwcm9wZXJ0eS1yZWFkT25seVxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IHJlYWRPbmx5KCBpc1JlYWRPbmx5OiBib29sZWFuICkge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0UmVhZE9ubHkoIGlzUmVhZE9ubHkgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEZWxheSBzZXR0aW5nIHJlYWQtb25seSBzdGF0ZSB1bnRpbCBlZGl0b3IgaW5pdGlhbGl6YXRpb24uXG5cdFx0dGhpcy5fcmVhZE9ubHkgPSBpc1JlYWRPbmx5O1xuXHR9XG5cblx0Z2V0IHJlYWRPbmx5KCk6IGJvb2xlYW4ge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHJldHVybiB0aGlzLmluc3RhbmNlLnJlYWRPbmx5O1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9yZWFkT25seTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaXJlZCB3aGVuIHRoZSBDS0VESVRPUiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SLmh0bWwgbmFtZXNwYWNlXG5cdCAqIGlzIGxvYWRlZC4gSXQgb25seSB0cmlnZ2VycyBvbmNlLCBubyBtYXR0ZXIgaG93IG1hbnkgQ0tFZGl0b3IgNCBjb21wb25lbnRzIGFyZSBpbml0aWFsaXNlZC5cblx0ICogQ2FuIGJlIHVzZWQgZm9yIGNvbnZlbmllbnQgY2hhbmdlcyBpbiB0aGUgbmFtZXNwYWNlLCBlLmcuIGZvciBhZGRpbmcgZXh0ZXJuYWwgcGx1Z2lucy5cblx0ICovXG5cdEBPdXRwdXQoKSBuYW1lc3BhY2VMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRvciBpcyByZWFkeS4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNpbnN0YW5jZVJlYWR5YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWluc3RhbmNlUmVhZHlcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRvciBkYXRhIGlzIGxvYWRlZCwgZS5nLiBhZnRlciBjYWxsaW5nIHNldERhdGEoKVxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI21ldGhvZC1zZXREYXRhXG5cdCAqIGVkaXRvcidzIG1ldGhvZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkYXRhUmVhZHlgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZGF0YVJlYWR5IGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRhdGFSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGhhcyBjaGFuZ2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2NoYW5nZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1jaGFuZ2Vcblx0ICogZXZlbnQuIEZvciBwZXJmb3JtYW5jZSByZWFzb25zIHRoaXMgZXZlbnQgbWF5IGJlIGNhbGxlZCBldmVuIHdoZW4gZGF0YSBkaWRuJ3QgcmVhbGx5IGNoYW5nZWQuXG5cdCAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCB3aWxsIG9ubHkgYmUgZmlyZWQgd2hlbiBgdW5kb2AgcGx1Z2luIGlzIGxvYWRlZC4gSWYgeW91IG5lZWQgdG9cblx0ICogbGlzdGVuIGZvciBlZGl0b3IgY2hhbmdlcyAoZS5nLiBmb3IgdHdvLXdheSBkYXRhIGJpbmRpbmcpLCB1c2UgYGRhdGFDaGFuZ2VgIGV2ZW50IGluc3RlYWQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgaGFzIGNoYW5nZWQuIEluIGNvbnRyYXN0IHRvIGBjaGFuZ2VgIC0gb25seSBlbWl0cyB3aGVuXG5cdCAqIGRhdGEgcmVhbGx5IGNoYW5nZWQgdGh1cyBjYW4gYmUgc3VjY2Vzc2Z1bGx5IHVzZWQgd2l0aCBgW2RhdGFdYCBhbmQgdHdvIHdheSBgWyhkYXRhKV1gIGJpbmRpbmcuXG5cdCAqXG5cdCAqIFNlZSBtb3JlOiBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvdGVtcGxhdGUtc3ludGF4I3R3by13YXktYmluZGluZy0tLVxuXHQgKi9cblx0QE91dHB1dCgpIGRhdGFDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcmFnU3RhcnQgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RyYWdzdGFydGBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcmFnc3RhcnRcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZHJhZ1N0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJhZ0VuZCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJhZ2VuZGBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcmFnZW5kXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcm9wIGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcm9wYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyb3Bcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZHJvcCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgcmVzcG9uc2UgaXMgcmVjZWl2ZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZmlsZVVwbG9hZFJlc3BvbnNlYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXNwb25zZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBmaWxlVXBsb2FkUmVzcG9uc2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGZpbGUgbG9hZGVyIHNob3VsZCBzZW5kIFhIUi4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmaWxlVXBsb2FkUmVxdWVzdGBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1maWxlVXBsb2FkUmVxdWVzdFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBmaWxlVXBsb2FkUmVxdWVzdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdGluZyBhcmVhIG9mIHRoZSBlZGl0b3IgaXMgZm9jdXNlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmb2N1c2Bcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1mb2N1c1xuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBmb2N1cyA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgYWZ0ZXIgdGhlIHVzZXIgaW5pdGlhdGVkIGEgcGFzdGUgYWN0aW9uLCBidXQgYmVmb3JlIHRoZSBkYXRhIGlzIGluc2VydGVkLlxuXHQgKiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI3Bhc3RlYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LXBhc3RlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIHBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyBhZnRlciB0aGUgYHBhc3RlYCBldmVudCBpZiBjb250ZW50IHdhcyBtb2RpZmllZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNhZnRlclBhc3RlYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWFmdGVyUGFzdGVcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgYWZ0ZXJQYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdGluZyB2aWV3IG9mIHRoZSBlZGl0b3IgaXMgYmx1cnJlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNibHVyYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWJsdXJcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgYmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgY2hhbmdlcy4gUGFydCBvZiB0aGVcblx0ICogYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3NvcikgaW50ZXJmYWNlLlxuXHQgKlxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXG5cdCAqL1xuXHRvbkNoYW5nZT86ICggZGF0YTogc3RyaW5nICkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBlZGl0b3IgaGFzIGJlZW4gYmx1cnJlZC4gUGFydCBvZiB0aGVcblx0ICogYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3NvcikgaW50ZXJmYWNlLlxuXHQgKlxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXG5cdCAqL1xuXHRvblRvdWNoZWQ/OiAoKSA9PiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGVkaXRvciBjcmVhdGVkIGJ5IHRoaXMgY29tcG9uZW50LlxuXHQgKi9cblx0aW5zdGFuY2U6IGFueTtcblxuXHQvKipcblx0ICogSWYgdGhlIGNvbXBvbmVudCBpcyByZWFk4oCTb25seSBiZWZvcmUgdGhlIGVkaXRvciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBpdCByZW1lbWJlcnMgdGhhdCBzdGF0ZSxcblx0ICogc28gdGhlIGVkaXRvciBjYW4gYmVjb21lIHJlYWTigJNvbmx5IG9uY2UgaXQgaXMgcmVhZHkuXG5cdCAqL1xuXHRwcml2YXRlIF9yZWFkT25seTogYm9vbGVhbiA9IG51bGw7XG5cblx0cHJpdmF0ZSBfZGF0YTogc3RyaW5nID0gbnVsbDtcblxuXHRwcml2YXRlIF9kZXN0cm95ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvciggcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIG5nWm9uZTogTmdab25lICkge31cblxuXHRuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG5cdFx0Z2V0RWRpdG9yTmFtZXNwYWNlKCB0aGlzLmVkaXRvclVybCwgbmFtZXNwYWNlID0+IHtcblx0XHRcdHRoaXMubmFtZXNwYWNlTG9hZGVkLmVtaXQoIG5hbWVzcGFjZSApO1xuXHRcdH0gKS50aGVuKCAoKSA9PiB7XG5cdFx0XHQvLyBDaGVjayBpZiBjb21wb25lbnQgaW5zdGFuY2Ugd2FzIGRlc3Ryb3llZCBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAgY2FsbCAoIzExMCkuXG5cdFx0XHQvLyBIZXJlLCBgdGhpcy5pbnN0YW5jZWAgaXMgc3RpbGwgbm90IGluaXRpYWxpemVkIGFuZCBzbyBhZGRpdGlvbmFsIGZsYWcgaXMgbmVlZGVkLlxuXHRcdFx0aWYgKCB0aGlzLl9kZXN0cm95ZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoIHRoaXMuY3JlYXRlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHRcdH0gKS5jYXRjaCggd2luZG93LmNvbnNvbGUuZXJyb3IgKTtcblx0fVxuXG5cdG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cblx0XHR0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhciggKCkgPT4ge1xuXHRcdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0XHR0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0dGhpcy5pbnN0YW5jZSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSggdmFsdWU6IHN0cmluZyApOiB2b2lkIHtcblx0XHR0aGlzLmRhdGEgPSB2YWx1ZTtcblx0fVxuXG5cdHJlZ2lzdGVyT25DaGFuZ2UoIGNhbGxiYWNrOiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQgKTogdm9pZCB7XG5cdFx0dGhpcy5vbkNoYW5nZSA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cmVnaXN0ZXJPblRvdWNoZWQoIGNhbGxiYWNrOiAoKSA9PiB2b2lkICk6IHZvaWQge1xuXHRcdHRoaXMub25Ub3VjaGVkID0gY2FsbGJhY2s7XG5cdH1cblxuXHRwcml2YXRlIGNyZWF0ZUVkaXRvcigpOiB2b2lkIHtcblx0XHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggdGhpcy50YWdOYW1lICk7XG5cdFx0dGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcblxuXHRcdGNvbnN0IHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2sgPSB0aGlzLmNvbmZpZz8ub24/Lmluc3RhbmNlUmVhZHk7XG5cdFx0Y29uc3QgZGVmYXVsdENvbmZpZzogUGFydGlhbDxDS0VkaXRvcjQuQ29uZmlnPiA9IHtcblx0XHRcdGRlbGF5SWZEZXRhY2hlZDogdHJ1ZVxuXHRcdH07XG5cdFx0Y29uc3QgY29uZmlnOiBQYXJ0aWFsPENLRWRpdG9yNC5Db25maWc+ID0geyAuLi5kZWZhdWx0Q29uZmlnLCAuLi50aGlzLmNvbmZpZyB9O1xuXG5cdFx0aWYgKCB0eXBlb2YgY29uZmlnLm9uID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbmZpZy5vbiA9IHt9O1xuXHRcdH1cblxuXHRcdGNvbmZpZy5vbi5pbnN0YW5jZVJlYWR5ID0gZXZ0ID0+IHtcblx0XHRcdGNvbnN0IGVkaXRvciA9IGV2dC5lZGl0b3I7XG5cblx0XHRcdHRoaXMuaW5zdGFuY2UgPSBlZGl0b3I7XG5cblx0XHRcdC8vIFJlYWQgb25seSBzdGF0ZSBtYXkgY2hhbmdlIGR1cmluZyBpbnN0YW5jZSBpbml0aWFsaXphdGlvbi5cblx0XHRcdHRoaXMucmVhZE9ubHkgPSB0aGlzLl9yZWFkT25seSAhPT0gbnVsbCA/IHRoaXMuX3JlYWRPbmx5IDogdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcblxuXHRcdFx0dGhpcy5zdWJzY3JpYmUoIHRoaXMuaW5zdGFuY2UgKTtcblxuXHRcdFx0Y29uc3QgdW5kbyA9IGVkaXRvci51bmRvTWFuYWdlcjtcblxuXHRcdFx0aWYgKCB0aGlzLmRhdGEgIT09IG51bGwgKSB7XG5cdFx0XHRcdHVuZG8gJiYgdW5kby5sb2NrKCk7XG5cblx0XHRcdFx0ZWRpdG9yLnNldERhdGEoIHRoaXMuZGF0YSwgeyBjYWxsYmFjazogKCkgPT4ge1xuXHRcdFx0XHRcdC8vIExvY2tpbmcgdW5kb01hbmFnZXIgcHJldmVudHMgJ2NoYW5nZScgZXZlbnQuXG5cdFx0XHRcdFx0Ly8gVHJpZ2dlciBpdCBtYW51YWxseSB0byB1cGRhdGVkIGJvdW5kIGRhdGEuXG5cdFx0XHRcdFx0aWYgKCB0aGlzLmRhdGEgIT09IGVkaXRvci5nZXREYXRhKCkgKSB7XG5cdFx0XHRcdFx0XHR1bmRvID8gZWRpdG9yLmZpcmUoICdjaGFuZ2UnICkgOiBlZGl0b3IuZmlyZSggJ2RhdGFSZWFkeScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dW5kbyAmJiB1bmRvLnVubG9jaygpO1xuXG5cdFx0XHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoIHR5cGVvZiB1c2VySW5zdGFuY2VSZWFkeUNhbGxiYWNrID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0XHR1c2VySW5zdGFuY2VSZWFkeUNhbGxiYWNrKCBldnQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gfSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2soIGV2dCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHRoaXMudHlwZSA9PT0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuSU5MSU5FICkge1xuXHRcdFx0Q0tFRElUT1IuaW5saW5lKCBlbGVtZW50LCBjb25maWcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Q0tFRElUT1IucmVwbGFjZSggZWxlbWVudCwgY29uZmlnICk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBzdWJzY3JpYmUoIGVkaXRvcjogYW55ICk6IHZvaWQge1xuXHRcdGVkaXRvci5vbiggJ2ZvY3VzJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZvY3VzLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ3Bhc3RlJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnBhc3RlLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2FmdGVyUGFzdGUnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYWZ0ZXJQYXN0ZS5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdkcmFnZW5kJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRyYWdFbmQuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSk7XG5cblx0XHRlZGl0b3Iub24oICdkcmFnc3RhcnQnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZHJhZ1N0YXJ0LmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2Ryb3AnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZHJvcC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVxdWVzdCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5maWxlVXBsb2FkUmVxdWVzdC5lbWl0KGV2dCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZmlsZVVwbG9hZFJlc3BvbnNlJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXNwb25zZS5lbWl0KGV2dCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYmx1cicsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0aWYgKCB0aGlzLm9uVG91Y2hlZCApIHtcblx0XHRcdFx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5ibHVyLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RhdGFSZWFkeScsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UudW5kb01hbmFnZXIgKSB7XG5cdFx0XHRlZGl0b3Iub24oICdjaGFuZ2UnLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0XHQvLyBJZiAndW5kbycgcGx1Z2luIGlzIG5vdCBsb2FkZWQsIGxpc3RlbiB0byAnc2VsZWN0aW9uQ2hlY2snIGV2ZW50IGluc3RlYWQuICgjNTQpLlxuXHRcdGVsc2Uge1xuXHRcdFx0ZWRpdG9yLm9uKCAnc2VsZWN0aW9uQ2hlY2snLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcHJvcGFnYXRlQ2hhbmdlKCBldmVudDogYW55ICk6IHZvaWQge1xuXHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3RGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXG5cdFx0XHRpZiAoIGV2ZW50Lm5hbWUgPT09ICdjaGFuZ2UnICkge1xuXHRcdFx0XHR0aGlzLmNoYW5nZS5lbWl0KCBldmVudCApO1xuXHRcdFx0fSBlbHNlIGlmICggZXZlbnQubmFtZSA9PT0gJ2RhdGFSZWFkeScgKSB7XG5cdFx0XHRcdHRoaXMuZGF0YVJlYWR5LmVtaXQoIGV2ZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbmV3RGF0YSA9PT0gdGhpcy5kYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2RhdGEgPSBuZXdEYXRhO1xuXHRcdFx0dGhpcy5kYXRhQ2hhbmdlLmVtaXQoIG5ld0RhdGEgKTtcblxuXHRcdFx0aWYgKCB0aGlzLm9uQ2hhbmdlICkge1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlKCBuZXdEYXRhICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cbn1cbiJdfQ==