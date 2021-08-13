/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { Component, NgZone, Input, Output, EventEmitter, forwardRef, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from 'ckeditor4-integrations-common';
export class CKEditorComponent {
    constructor(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        /**
         * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
         *
         * Defaults to 'https://cdn.ckeditor.com/4.16.2/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.16.2/standard-all/ckeditor.js';
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
        const instance = this.type === "inline" /* INLINE */
            ? CKEDITOR.inline(element, this.config)
            : CKEDITOR.replace(element, this.config);
        instance.once('instanceReady', evt => {
            this.instance = instance;
            // Read only state may change during instance initialization.
            this.readOnly = this._readOnly !== null ? this._readOnly : this.instance.readOnly;
            this.subscribe(this.instance);
            const undo = instance.undoManager;
            if (this.data !== null) {
                undo && undo.lock();
                instance.setData(this.data, { callback: () => {
                        // Locking undoManager prevents 'change' event.
                        // Trigger it manually to updated bound data.
                        if (this.data !== instance.getData()) {
                            undo ? instance.fire('change') : instance.fire('dataReady');
                        }
                        undo && undo.unlock();
                        this.ngZone.run(() => {
                            this.ready.emit(evt);
                        });
                    } });
            }
            else {
                this.ngZone.run(() => {
                    this.ready.emit(evt);
                });
            }
        });
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
CKEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'ckeditor',
                template: '<ng-template></ng-template>',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => CKEditorComponent),
                        multi: true,
                    }
                ]
            },] }
];
CKEditorComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
CKEditorComponent.propDecorators = {
    config: [{ type: Input }],
    editorUrl: [{ type: Input }],
    tagName: [{ type: Input }],
    type: [{ type: Input }],
    data: [{ type: Input }],
    readOnly: [{ type: Input }],
    namespaceLoaded: [{ type: Output }],
    ready: [{ type: Output }],
    dataReady: [{ type: Output }],
    change: [{ type: Output }],
    dataChange: [{ type: Output }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    drop: [{ type: Output }],
    fileUploadResponse: [{ type: Output }],
    fileUploadRequest: [{ type: Output }],
    focus: [{ type: Output }],
    paste: [{ type: Output }],
    afterPaste: [{ type: Output }],
    blur: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsVUFBVSxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTixpQkFBaUIsRUFDakIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQWtCbkUsTUFBTSxPQUFPLGlCQUFpQjtJQTJON0IsWUFBcUIsVUFBc0IsRUFBVSxNQUFjO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBbE5uRTs7OztXQUlHO1FBQ00sY0FBUyxHQUFHLDBEQUEwRCxDQUFDO1FBRWhGOzs7O1dBSUc7UUFDTSxZQUFPLEdBQUcsVUFBVSxDQUFDO1FBRTlCOzs7Ozs7Ozs7V0FTRztRQUNNLFNBQUksMkJBQXNEO1FBb0RuRTs7OztXQUlHO1FBQ08sb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUVwRTs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTFEOzs7OztXQUtHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7Ozs7V0FNRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUzRDs7Ozs7V0FLRztRQUNPLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUvRDs7OztXQUlHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7O1dBSUc7UUFDTyxZQUFPLEdBQUcsSUFB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QUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFFLENBQUM7UUFDTCxDQUFDLENBQUUsQ0FBQztRQUVKLE1BQU0sQ0FBQyxFQUFFLENBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFFLENBQUM7UUFDTCxDQUFDLENBQUUsQ0FBQztRQUVKLE1BQU0sQ0FBQyxFQUFFLENBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFFLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxFQUFFLENBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDNUIsQ0FBQyxDQUFFLENBQUM7UUFDTCxDQUFDLENBQUUsQ0FBQztRQUVKLE1BQU0sQ0FBQyxFQUFFLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFFLEdBQUcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUM7WUFDdkIsQ0FBQyxDQUFFLENBQUM7UUFDTCxD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U0wsS0FBSzt1QkF5QkwsS0FBSzs4QkF1QkwsTUFBTTtvQkFPTixNQUFNO3dCQVFOLE1BQU07cUJBU04sTUFBTTt5QkFRTixNQUFNO3dCQU9OLE1BQU07c0JBT04sTUFBTTttQkFPTixNQUFNO2lDQU9OLE1BQU07Z0NBT04sTUFBTTtvQkFPTixNQUFNO29CQVFOLE1BQU07eUJBT04sTUFBTTttQkFPTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMSwgQ0tTb3VyY2UgLSBGcmVkZXJpY28gS25hYmJlbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5cbmltcG9ydCB7XG5cdENvbXBvbmVudCxcblx0Tmdab25lLFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEVsZW1lbnRSZWYsXG5cdEFmdGVyVmlld0luaXQsIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcblx0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG5cdE5HX1ZBTFVFX0FDQ0VTU09SXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgZ2V0RWRpdG9yTmFtZXNwYWNlIH0gZnJvbSAnY2tlZGl0b3I0LWludGVncmF0aW9ucy1jb21tb24nO1xuXG5pbXBvcnQgeyBDS0VkaXRvcjQgfSBmcm9tICcuL2NrZWRpdG9yJztcblxuZGVjbGFyZSBsZXQgQ0tFRElUT1I6IGFueTtcblxuQENvbXBvbmVudCgge1xuXHRzZWxlY3RvcjogJ2NrZWRpdG9yJyxcblx0dGVtcGxhdGU6ICc8bmctdGVtcGxhdGU+PC9uZy10ZW1wbGF0ZT4nLFxuXG5cdHByb3ZpZGVyczogW1xuXHRcdHtcblx0XHRcdHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuXHRcdFx0dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoICgpID0+IENLRWRpdG9yQ29tcG9uZW50ICksXG5cdFx0XHRtdWx0aTogdHJ1ZSxcblx0XHR9XG5cdF1cbn0gKVxuZXhwb3J0IGNsYXNzIENLRWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG5cdC8qKlxuXHQgKiBUaGUgY29uZmlndXJhdGlvbiBvZiB0aGUgZWRpdG9yLlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9jb25maWcuaHRtbFxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgY29uZmlnPzogQ0tFZGl0b3I0LkNvbmZpZztcblxuXHQvKipcblx0ICogQ0tFZGl0b3IgNCBzY3JpcHQgdXJsIGFkZHJlc3MuIFNjcmlwdCB3aWxsIGJlIGxvYWRlZCBvbmx5IGlmIENLRURJVE9SIG5hbWVzcGFjZSBpcyBtaXNzaW5nLlxuXHQgKlxuXHQgKiBEZWZhdWx0cyB0byAnaHR0cHM6Ly9jZG4uY2tlZGl0b3IuY29tLzQuMTYuMi9zdGFuZGFyZC1hbGwvY2tlZGl0b3IuanMnXG5cdCAqL1xuXHRASW5wdXQoKSBlZGl0b3JVcmwgPSAnaHR0cHM6Ly9jZG4uY2tlZGl0b3IuY29tLzQuMTYuMi9zdGFuZGFyZC1hbGwvY2tlZGl0b3IuanMnO1xuXG5cdC8qKlxuXHQgKiBUYWcgbmFtZSBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudC5cblx0ICpcblx0ICogVGhlIGRlZmF1bHQgdGFnIGlzIGB0ZXh0YXJlYWAuXG5cdCAqL1xuXHRASW5wdXQoKSB0YWdOYW1lID0gJ3RleHRhcmVhJztcblxuXHQvKipcblx0ICogVGhlIHR5cGUgb2YgdGhlIGVkaXRvciBpbnRlcmZhY2UuXG5cdCAqXG5cdCAqIEJ5IGRlZmF1bHQgZWRpdG9yIGludGVyZmFjZSB3aWxsIGJlIGluaXRpYWxpemVkIGFzIGBjbGFzc2ljYCBlZGl0b3IuXG5cdCAqIFlvdSBjYW4gYWxzbyBjaG9vc2UgdG8gY3JlYXRlIGFuIGVkaXRvciB3aXRoIGBpbmxpbmVgIGludGVyZmFjZSB0eXBlIGluc3RlYWQuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZ3VpZGUvZGV2X3VpdHlwZXMuaHRtbFxuXHQgKiBhbmQgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2V4YW1wbGVzL2ZpeGVkdWkuaHRtbFxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgdHlwZTogQ0tFZGl0b3I0LkVkaXRvclR5cGUgPSBDS0VkaXRvcjQuRWRpdG9yVHlwZS5DTEFTU0lDO1xuXG5cdC8qKlxuXHQgKiBLZWVwcyB0cmFjayBvZiB0aGUgZWRpdG9yJ3MgZGF0YS5cblx0ICpcblx0ICogSXQncyBhbHNvIGRlY29yYXRlZCBhcyBhbiBpbnB1dCB3aGljaCBpcyB1c2VmdWwgd2hlbiBub3QgdXNpbmcgdGhlIG5nTW9kZWwuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL05nTW9kZWwgdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHNldCBkYXRhKCBkYXRhOiBzdHJpbmcgKSB7XG5cdFx0aWYgKCBkYXRhID09PSB0aGlzLl9kYXRhICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0RGF0YSggZGF0YSApO1xuXHRcdFx0Ly8gRGF0YSBtYXkgYmUgY2hhbmdlZCBieSBBQ0YuXG5cdFx0XHR0aGlzLl9kYXRhID0gdGhpcy5pbnN0YW5jZS5nZXREYXRhKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fZGF0YSA9IGRhdGE7XG5cdH1cblxuXHRnZXQgZGF0YSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIGVkaXRvciBiZWNvbWVzIHJlYWQtb25seS5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjcHJvcGVydHktcmVhZE9ubHlcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHNldCByZWFkT25seSggaXNSZWFkT25seTogYm9vbGVhbiApIHtcblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlLnNldFJlYWRPbmx5KCBpc1JlYWRPbmx5ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRGVsYXkgc2V0dGluZyByZWFkLW9ubHkgc3RhdGUgdW50aWwgZWRpdG9yIGluaXRpYWxpemF0aW9uLlxuXHRcdHRoaXMuX3JlYWRPbmx5ID0gaXNSZWFkT25seTtcblx0fVxuXG5cdGdldCByZWFkT25seSgpOiBib29sZWFuIHtcblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVhZE9ubHk7XG5cdH1cblxuXHQvKipcblx0ICogRmlyZWQgd2hlbiB0aGUgQ0tFRElUT1IgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUi5odG1sIG5hbWVzcGFjZVxuXHQgKiBpcyBsb2FkZWQuIEl0IG9ubHkgdHJpZ2dlcnMgb25jZSwgbm8gbWF0dGVyIGhvdyBtYW55IENLRWRpdG9yIDQgY29tcG9uZW50cyBhcmUgaW5pdGlhbGlzZWQuXG5cdCAqIENhbiBiZSB1c2VkIGZvciBjb252ZW5pZW50IGNoYW5nZXMgaW4gdGhlIG5hbWVzcGFjZSwgZS5nLiBmb3IgYWRkaW5nIGV4dGVybmFsIHBsdWdpbnMuXG5cdCAqL1xuXHRAT3V0cHV0KCkgbmFtZXNwYWNlTG9hZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgaXMgcmVhZHkuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjaW5zdGFuY2VSZWFkeWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1pbnN0YW5jZVJlYWR5XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgZGF0YSBpcyBsb2FkZWQsIGUuZy4gYWZ0ZXIgY2FsbGluZyBzZXREYXRhKClcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNtZXRob2Qtc2V0RGF0YVxuXHQgKiBlZGl0b3IncyBtZXRob2QuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZGF0YVJlYWR5YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRhdGFSZWFkeSBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhUmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNjaGFuZ2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtY2hhbmdlXG5cdCAqIGV2ZW50LiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB0aGlzIGV2ZW50IG1heSBiZSBjYWxsZWQgZXZlbiB3aGVuIGRhdGEgZGlkbid0IHJlYWxseSBjaGFuZ2VkLlxuXHQgKiBQbGVhc2Ugbm90ZSB0aGF0IHRoaXMgZXZlbnQgd2lsbCBvbmx5IGJlIGZpcmVkIHdoZW4gYHVuZG9gIHBsdWdpbiBpcyBsb2FkZWQuIElmIHlvdSBuZWVkIHRvXG5cdCAqIGxpc3RlbiBmb3IgZWRpdG9yIGNoYW5nZXMgKGUuZy4gZm9yIHR3by13YXkgZGF0YSBiaW5kaW5nKSwgdXNlIGBkYXRhQ2hhbmdlYCBldmVudCBpbnN0ZWFkLlxuXHQgKi9cblx0QE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGhhcyBjaGFuZ2VkLiBJbiBjb250cmFzdCB0byBgY2hhbmdlYCAtIG9ubHkgZW1pdHMgd2hlblxuXHQgKiBkYXRhIHJlYWxseSBjaGFuZ2VkIHRodXMgY2FuIGJlIHN1Y2Nlc3NmdWxseSB1c2VkIHdpdGggYFtkYXRhXWAgYW5kIHR3byB3YXkgYFsoZGF0YSldYCBiaW5kaW5nLlxuXHQgKlxuXHQgKiBTZWUgbW9yZTogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL3RlbXBsYXRlLXN5bnRheCN0d28td2F5LWJpbmRpbmctLS1cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJhZ1N0YXJ0IGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnc3RhcnRgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJhZ3N0YXJ0XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyYWdFbmQgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RyYWdlbmRgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJhZ2VuZFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJvcCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJvcGBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcm9wXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRyb3AgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGZpbGUgbG9hZGVyIHJlc3BvbnNlIGlzIHJlY2VpdmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXNwb25zZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1maWxlVXBsb2FkUmVzcG9uc2Vcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZmlsZVVwbG9hZFJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBmaWxlIGxvYWRlciBzaG91bGQgc2VuZCBYSFIuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZmlsZVVwbG9hZFJlcXVlc3RgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlcXVlc3Rcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZmlsZVVwbG9hZFJlcXVlc3QgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgYXJlYSBvZiB0aGUgZWRpdG9yIGlzIGZvY3VzZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZm9jdXNgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZm9jdXNcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSB1c2VyIGluaXRpYXRlZCBhIHBhc3RlIGFjdGlvbiwgYnV0IGJlZm9yZSB0aGUgZGF0YSBpcyBpbnNlcnRlZC5cblx0ICogSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNwYXN0ZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1wYXN0ZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBwYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgYWZ0ZXIgdGhlIGBwYXN0ZWAgZXZlbnQgaWYgY29udGVudCB3YXMgbW9kaWZpZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYWZ0ZXJQYXN0ZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1hZnRlclBhc3RlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGFmdGVyUGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgdmlldyBvZiB0aGUgZWRpdG9yIGlzIGJsdXJyZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYmx1cmBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1ibHVyXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGNoYW5nZXMuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25DaGFuZ2U/OiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgZWRpdG9yIGhhcyBiZWVuIGJsdXJyZWQuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25Ub3VjaGVkPzogKCkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogVGhlIGluc3RhbmNlIG9mIHRoZSBlZGl0b3IgY3JlYXRlZCBieSB0aGlzIGNvbXBvbmVudC5cblx0ICovXG5cdGluc3RhbmNlOiBhbnk7XG5cblx0LyoqXG5cdCAqIElmIHRoZSBjb21wb25lbnQgaXMgcmVhZOKAk29ubHkgYmVmb3JlIHRoZSBlZGl0b3IgaW5zdGFuY2UgaXMgY3JlYXRlZCwgaXQgcmVtZW1iZXJzIHRoYXQgc3RhdGUsXG5cdCAqIHNvIHRoZSBlZGl0b3IgY2FuIGJlY29tZSByZWFk4oCTb25seSBvbmNlIGl0IGlzIHJlYWR5LlxuXHQgKi9cblx0cHJpdmF0ZSBfcmVhZE9ubHk6IGJvb2xlYW4gPSBudWxsO1xuXG5cdHByaXZhdGUgX2RhdGE6IHN0cmluZyA9IG51bGw7XG5cblx0cHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3IoIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSApIHt9XG5cblx0bmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuXHRcdGdldEVkaXRvck5hbWVzcGFjZSggdGhpcy5lZGl0b3JVcmwsIG5hbWVzcGFjZSA9PiB7XG5cdFx0XHR0aGlzLm5hbWVzcGFjZUxvYWRlZC5lbWl0KCBuYW1lc3BhY2UgKTtcblx0XHR9ICkudGhlbiggKCkgPT4ge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgY29tcG9uZW50IGluc3RhbmNlIHdhcyBkZXN0cm95ZWQgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGwgKCMxMTApLlxuXHRcdFx0Ly8gSGVyZSwgYHRoaXMuaW5zdGFuY2VgIGlzIHN0aWxsIG5vdCBpbml0aWFsaXplZCBhbmQgc28gYWRkaXRpb25hbCBmbGFnIGlzIG5lZWRlZC5cblx0XHRcdGlmICggdGhpcy5fZGVzdHJveWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCB0aGlzLmNyZWF0ZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0XHR9ICkuY2F0Y2goIHdpbmRvdy5jb25zb2xlLmVycm9yICk7XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpOiB2b2lkIHtcblx0XHR0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXG5cdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoICgpID0+IHtcblx0XHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdFx0dGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUoIHZhbHVlOiBzdHJpbmcgKTogdm9pZCB7XG5cdFx0dGhpcy5kYXRhID0gdmFsdWU7XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKCBjYWxsYmFjazogKCBkYXRhOiBzdHJpbmcgKSA9PiB2b2lkICk6IHZvaWQge1xuXHRcdHRoaXMub25DaGFuZ2UgPSBjYWxsYmFjaztcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKCBjYWxsYmFjazogKCkgPT4gdm9pZCApOiB2b2lkIHtcblx0XHR0aGlzLm9uVG91Y2hlZCA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVFZGl0b3IoKTogdm9pZCB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRoaXMudGFnTmFtZSApO1xuXHRcdHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XG5cblx0XHRjb25zdCBpbnN0YW5jZTogQ0tFZGl0b3I0LkVkaXRvciA9IHRoaXMudHlwZSA9PT0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuSU5MSU5FXG5cdFx0XHQ/IENLRURJVE9SLmlubGluZSggZWxlbWVudCwgdGhpcy5jb25maWcgKVxuXHRcdFx0OiBDS0VESVRPUi5yZXBsYWNlKCBlbGVtZW50LCB0aGlzLmNvbmZpZyApO1xuXG5cdFx0aW5zdGFuY2Uub25jZSggJ2luc3RhbmNlUmVhZHknLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXG5cdFx0XHQvLyBSZWFkIG9ubHkgc3RhdGUgbWF5IGNoYW5nZSBkdXJpbmcgaW5zdGFuY2UgaW5pdGlhbGl6YXRpb24uXG5cdFx0XHR0aGlzLnJlYWRPbmx5ID0gdGhpcy5fcmVhZE9ubHkgIT09IG51bGwgPyB0aGlzLl9yZWFkT25seSA6IHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XG5cblx0XHRcdHRoaXMuc3Vic2NyaWJlKCB0aGlzLmluc3RhbmNlICk7XG5cblx0XHRcdGNvbnN0IHVuZG8gPSBpbnN0YW5jZS51bmRvTWFuYWdlcjtcblxuXHRcdFx0aWYgKCB0aGlzLmRhdGEgIT09IG51bGwgKSB7XG5cdFx0XHRcdHVuZG8gJiYgdW5kby5sb2NrKCk7XG5cblx0XHRcdFx0aW5zdGFuY2Uuc2V0RGF0YSggdGhpcy5kYXRhLCB7IGNhbGxiYWNrOiAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gTG9ja2luZyB1bmRvTWFuYWdlciBwcmV2ZW50cyAnY2hhbmdlJyBldmVudC5cblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGl0IG1hbnVhbGx5IHRvIHVwZGF0ZWQgYm91bmQgZGF0YS5cblx0XHRcdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gaW5zdGFuY2UuZ2V0RGF0YSgpICkge1xuXHRcdFx0XHRcdFx0dW5kbyA/IGluc3RhbmNlLmZpcmUoICdjaGFuZ2UnICkgOiBpbnN0YW5jZS5maXJlKCAnZGF0YVJlYWR5JyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1bmRvICYmIHVuZG8udW5sb2NrKCk7XG5cblx0XHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9IH0gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRwcml2YXRlIHN1YnNjcmliZSggZWRpdG9yOiBhbnkgKTogdm9pZCB7XG5cdFx0ZWRpdG9yLm9uKCAnZm9jdXMnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZm9jdXMuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAncGFzdGUnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGFzdGUuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYWZ0ZXJQYXN0ZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5hZnRlclBhc3RlLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdlbmQnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZHJhZ0VuZC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9KTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdzdGFydCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcmFnU3RhcnQuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJvcCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcm9wLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXF1ZXN0LmVtaXQoZXZ0KTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVzcG9uc2UnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZmlsZVVwbG9hZFJlc3BvbnNlLmVtaXQoZXZ0KTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdibHVyJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRpZiAoIHRoaXMub25Ub3VjaGVkICkge1xuXHRcdFx0XHRcdHRoaXMub25Ub3VjaGVkKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmJsdXIuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZGF0YVJlYWR5JywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcblxuXHRcdGlmICggdGhpcy5pbnN0YW5jZS51bmRvTWFuYWdlciApIHtcblx0XHRcdGVkaXRvci5vbiggJ2NoYW5nZScsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cdFx0fVxuXHRcdC8vIElmICd1bmRvJyBwbHVnaW4gaXMgbm90IGxvYWRlZCwgbGlzdGVuIHRvICdzZWxlY3Rpb25DaGVjaycgZXZlbnQgaW5zdGVhZC4gKCM1NCkuXG5cdFx0ZWxzZSB7XG5cdFx0XHRlZGl0b3Iub24oICdzZWxlY3Rpb25DaGVjaycsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwcm9wYWdhdGVDaGFuZ2UoIGV2ZW50OiBhbnkgKTogdm9pZCB7XG5cdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdEYXRhID0gdGhpcy5pbnN0YW5jZS5nZXREYXRhKCk7XG5cblx0XHRcdGlmICggZXZlbnQubmFtZSA9PT0gJ2NoYW5nZScgKSB7XG5cdFx0XHRcdHRoaXMuY2hhbmdlLmVtaXQoIGV2ZW50ICk7XG5cdFx0XHR9IGVsc2UgaWYgKCBldmVudC5uYW1lID09PSAnZGF0YVJlYWR5JyApIHtcblx0XHRcdFx0dGhpcy5kYXRhUmVhZHkuZW1pdCggZXZlbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBuZXdEYXRhID09PSB0aGlzLmRhdGEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fZGF0YSA9IG5ld0RhdGE7XG5cdFx0XHR0aGlzLmRhdGFDaGFuZ2UuZW1pdCggbmV3RGF0YSApO1xuXG5cdFx0XHRpZiAoIHRoaXMub25DaGFuZ2UgKSB7XG5cdFx0XHRcdHRoaXMub25DaGFuZ2UoIG5ld0RhdGEgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxufVxuIl19