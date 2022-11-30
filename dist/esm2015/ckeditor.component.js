/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
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
         * Defaults to 'https://cdn.ckeditor.com/4.20.1/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.20.1/standard-all/ckeditor.js';
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
        var _a, _b;
        const element = document.createElement(this.tagName);
        this.elementRef.nativeElement.appendChild(element);
        const userInstanceReadyCallback = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.on) === null || _b === void 0 ? void 0 : _b.instanceReady;
        const defaultConfig = {
            delayIfDetached: true
        };
        const config = Object.assign(Object.assign({}, defaultConfig), this.config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NrZWRpdG9yL2NrZWRpdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsVUFBVSxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTixpQkFBaUIsRUFDakIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQWtCbkUsTUFBTSxPQUFPLGlCQUFpQjtJQTJON0IsWUFBcUIsVUFBc0IsRUFBVSxNQUFjO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBbE5uRTs7OztXQUlHO1FBQ00sY0FBUyxHQUFHLDBEQUEwRCxDQUFDO1FBRWhGOzs7O1dBSUc7UUFDTSxZQUFPLEdBQUcsVUFBVSxDQUFDO1FBRTlCOzs7Ozs7Ozs7V0FTRztRQUNNLFNBQUksMkJBQXNEO1FBb0RuRTs7OztXQUlHO1FBQ08sb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUVwRTs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTFEOzs7OztXQUtHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7Ozs7V0FNRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUzRDs7Ozs7V0FLRztRQUNPLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUvRDs7OztXQUlHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7O1dBSUc7UUFDTyxZQUFPLEdBQUcsSUFB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LENBQUM7WUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFFLENBQUM7WUFFaEMsSUFBSyxJQUFJLENBQUMsUUFBUSxFQUFHO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFFLE9BQU8sQ0FBRSxDQUFDO2FBQ3pCO1FBQ0YsQ0FBQyxDQUFFLENBQUM7SUFDTCxDQUFDOzs7WUF4YUQsU0FBUyxTQUFFO2dCQUNYLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsNkJBQTZCO2dCQUV2QyxTQUFTLEVBQUU7b0JBQ1Y7d0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBRSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBRTt3QkFDbEQsS0FBSyxFQUFFLElBQUk7cUJBQ1g7aUJBQ0Q7YUFDRDs7O1lBMUJBLFVBQVU7WUFMVixNQUFNOzs7cUJBdUNMLEtBQUs7d0JBT0wsS0FBSztzQkFPTCxLQUFLO21CQVlMLEtBQUs7bUJBU0wsS0FBSzt1QkF5QkwsS0FBSzs4QkF1QkwsTUFBTTtvQkFPTixNQUFNO3dCQVFOLE1BQU07cUJBU04sTUFBTTt5QkFRTixNQUFNO3dCQU9OLE1BQU07c0JBT04sTUFBTTttQkFPTixNQUFNO2lDQU9OLE1BQU07Z0NBT04sTUFBTTtvQkFPTixNQUFNO29CQVFOLE1BQU07eUJBT04sTUFBTTttQkFPTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMiwgQ0tTb3VyY2UgSG9sZGluZyBzcC4geiBvLm8uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZC5cbiAqL1xuXG5pbXBvcnQge1xuXHRDb21wb25lbnQsXG5cdE5nWm9uZSxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRFbGVtZW50UmVmLFxuXHRBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG5cdENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuXHROR19WQUxVRV9BQ0NFU1NPUlxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IGdldEVkaXRvck5hbWVzcGFjZSB9IGZyb20gJ2NrZWRpdG9yNC1pbnRlZ3JhdGlvbnMtY29tbW9uJztcblxuaW1wb3J0IHsgQ0tFZGl0b3I0IH0gZnJvbSAnLi9ja2VkaXRvcic7XG5cbmRlY2xhcmUgbGV0IENLRURJVE9SOiBhbnk7XG5cbkBDb21wb25lbnQoIHtcblx0c2VsZWN0b3I6ICdja2VkaXRvcicsXG5cdHRlbXBsYXRlOiAnPG5nLXRlbXBsYXRlPjwvbmctdGVtcGxhdGU+JyxcblxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCAoKSA9PiBDS0VkaXRvckNvbXBvbmVudCApLFxuXHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0fVxuXHRdXG59IClcbmV4cG9ydCBjbGFzcyBDS0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXHQvKipcblx0ICogVGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGVkaXRvci5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfY29uZmlnLmh0bWxcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIGNvbmZpZz86IENLRWRpdG9yNC5Db25maWc7XG5cblx0LyoqXG5cdCAqIENLRWRpdG9yIDQgc2NyaXB0IHVybCBhZGRyZXNzLiBTY3JpcHQgd2lsbCBiZSBsb2FkZWQgb25seSBpZiBDS0VESVRPUiBuYW1lc3BhY2UgaXMgbWlzc2luZy5cblx0ICpcblx0ICogRGVmYXVsdHMgdG8gJ2h0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbS80LjIwLjEvc3RhbmRhcmQtYWxsL2NrZWRpdG9yLmpzJ1xuXHQgKi9cblx0QElucHV0KCkgZWRpdG9yVXJsID0gJ2h0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbS80LjIwLjEvc3RhbmRhcmQtYWxsL2NrZWRpdG9yLmpzJztcblxuXHQvKipcblx0ICogVGFnIG5hbWUgb2YgdGhlIGVkaXRvciBjb21wb25lbnQuXG5cdCAqXG5cdCAqIFRoZSBkZWZhdWx0IHRhZyBpcyBgdGV4dGFyZWFgLlxuXHQgKi9cblx0QElucHV0KCkgdGFnTmFtZSA9ICd0ZXh0YXJlYSc7XG5cblx0LyoqXG5cdCAqIFRoZSB0eXBlIG9mIHRoZSBlZGl0b3IgaW50ZXJmYWNlLlxuXHQgKlxuXHQgKiBCeSBkZWZhdWx0IGVkaXRvciBpbnRlcmZhY2Ugd2lsbCBiZSBpbml0aWFsaXplZCBhcyBgY2xhc3NpY2AgZWRpdG9yLlxuXHQgKiBZb3UgY2FuIGFsc28gY2hvb3NlIHRvIGNyZWF0ZSBhbiBlZGl0b3Igd2l0aCBgaW5saW5lYCBpbnRlcmZhY2UgdHlwZSBpbnN0ZWFkLlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2d1aWRlL2Rldl91aXR5cGVzLmh0bWxcblx0ICogYW5kIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9leGFtcGxlcy9maXhlZHVpLmh0bWxcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHR5cGU6IENLRWRpdG9yNC5FZGl0b3JUeXBlID0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuQ0xBU1NJQztcblxuXHQvKipcblx0ICogS2VlcHMgdHJhY2sgb2YgdGhlIGVkaXRvcidzIGRhdGEuXG5cdCAqXG5cdCAqIEl0J3MgYWxzbyBkZWNvcmF0ZWQgYXMgYW4gaW5wdXQgd2hpY2ggaXMgdXNlZnVsIHdoZW4gbm90IHVzaW5nIHRoZSBuZ01vZGVsLlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9OZ01vZGVsIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSBzZXQgZGF0YSggZGF0YTogc3RyaW5nICkge1xuXHRcdGlmICggZGF0YSA9PT0gdGhpcy5fZGF0YSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlLnNldERhdGEoIGRhdGEgKTtcblx0XHRcdC8vIERhdGEgbWF5IGJlIGNoYW5nZWQgYnkgQUNGLlxuXHRcdFx0dGhpcy5fZGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX2RhdGEgPSBkYXRhO1xuXHR9XG5cblx0Z2V0IGRhdGEoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5fZGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaGVuIHNldCB0byBgdHJ1ZWAsIHRoZSBlZGl0b3IgYmVjb21lcyByZWFkLW9ubHkuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI3Byb3BlcnR5LXJlYWRPbmx5XG5cdCAqIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSBzZXQgcmVhZE9ubHkoIGlzUmVhZE9ubHk6IGJvb2xlYW4gKSB7XG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0dGhpcy5pbnN0YW5jZS5zZXRSZWFkT25seSggaXNSZWFkT25seSApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERlbGF5IHNldHRpbmcgcmVhZC1vbmx5IHN0YXRlIHVudGlsIGVkaXRvciBpbml0aWFsaXphdGlvbi5cblx0XHR0aGlzLl9yZWFkT25seSA9IGlzUmVhZE9ubHk7XG5cdH1cblxuXHRnZXQgcmVhZE9ubHkoKTogYm9vbGVhbiB7XG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3JlYWRPbmx5O1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpcmVkIHdoZW4gdGhlIENLRURJVE9SIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1IuaHRtbCBuYW1lc3BhY2Vcblx0ICogaXMgbG9hZGVkLiBJdCBvbmx5IHRyaWdnZXJzIG9uY2UsIG5vIG1hdHRlciBob3cgbWFueSBDS0VkaXRvciA0IGNvbXBvbmVudHMgYXJlIGluaXRpYWxpc2VkLlxuXHQgKiBDYW4gYmUgdXNlZCBmb3IgY29udmVuaWVudCBjaGFuZ2VzIGluIHRoZSBuYW1lc3BhY2UsIGUuZy4gZm9yIGFkZGluZyBleHRlcm5hbCBwbHVnaW5zLlxuXHQgKi9cblx0QE91dHB1dCgpIG5hbWVzcGFjZUxvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGlzIHJlYWR5LiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2luc3RhbmNlUmVhZHlgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtaW5zdGFuY2VSZWFkeVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGRhdGEgaXMgbG9hZGVkLCBlLmcuIGFmdGVyIGNhbGxpbmcgc2V0RGF0YSgpXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjbWV0aG9kLXNldERhdGFcblx0ICogZWRpdG9yJ3MgbWV0aG9kLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RhdGFSZWFkeWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kYXRhUmVhZHkgZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZGF0YVJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgaGFzIGNoYW5nZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjY2hhbmdlYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWNoYW5nZVxuXHQgKiBldmVudC4gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMgdGhpcyBldmVudCBtYXkgYmUgY2FsbGVkIGV2ZW4gd2hlbiBkYXRhIGRpZG4ndCByZWFsbHkgY2hhbmdlZC5cblx0ICogUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGV2ZW50IHdpbGwgb25seSBiZSBmaXJlZCB3aGVuIGB1bmRvYCBwbHVnaW4gaXMgbG9hZGVkLiBJZiB5b3UgbmVlZCB0b1xuXHQgKiBsaXN0ZW4gZm9yIGVkaXRvciBjaGFuZ2VzIChlLmcuIGZvciB0d28td2F5IGRhdGEgYmluZGluZyksIHVzZSBgZGF0YUNoYW5nZWAgZXZlbnQgaW5zdGVhZC5cblx0ICovXG5cdEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSW4gY29udHJhc3QgdG8gYGNoYW5nZWAgLSBvbmx5IGVtaXRzIHdoZW5cblx0ICogZGF0YSByZWFsbHkgY2hhbmdlZCB0aHVzIGNhbiBiZSBzdWNjZXNzZnVsbHkgdXNlZCB3aXRoIGBbZGF0YV1gIGFuZCB0d28gd2F5IGBbKGRhdGEpXWAgYmluZGluZy5cblx0ICpcblx0ICogU2VlIG1vcmU6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS90ZW1wbGF0ZS1zeW50YXgjdHdvLXdheS1iaW5kaW5nLS0tXG5cdCAqL1xuXHRAT3V0cHV0KCkgZGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyYWdTdGFydCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJhZ3N0YXJ0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdzdGFydFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcmFnRW5kIGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnZW5kYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdlbmRcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyb3AgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2Ryb3BgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJvcFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcm9wID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBmaWxlIGxvYWRlciByZXNwb25zZSBpcyByZWNlaXZlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmaWxlVXBsb2FkUmVzcG9uc2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlc3BvbnNlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgc2hvdWxkIHNlbmQgWEhSLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXF1ZXN0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXF1ZXN0XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXF1ZXN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIGFyZWEgb2YgdGhlIGVkaXRvciBpcyBmb2N1c2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZvY3VzYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZvY3VzXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyBhZnRlciB0aGUgdXNlciBpbml0aWF0ZWQgYSBwYXN0ZSBhY3Rpb24sIGJ1dCBiZWZvcmUgdGhlIGRhdGEgaXMgaW5zZXJ0ZWQuXG5cdCAqIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjcGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtcGFzdGVcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgcGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSBgcGFzdGVgIGV2ZW50IGlmIGNvbnRlbnQgd2FzIG1vZGlmaWVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2FmdGVyUGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYWZ0ZXJQYXN0ZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBhZnRlclBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIHZpZXcgb2YgdGhlIGVkaXRvciBpcyBibHVycmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2JsdXJgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYmx1clxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBjaGFuZ2VzLiBQYXJ0IG9mIHRoZVxuXHQgKiBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIChodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSBpbnRlcmZhY2UuXG5cdCAqXG5cdCAqIE5vdGU6IFVuc2V0IHVubGVzcyB0aGUgY29tcG9uZW50IHVzZXMgdGhlIGBuZ01vZGVsYC5cblx0ICovXG5cdG9uQ2hhbmdlPzogKCBkYXRhOiBzdHJpbmcgKSA9PiB2b2lkO1xuXG5cdC8qKlxuXHQgKiBBIGNhbGxiYWNrIGV4ZWN1dGVkIHdoZW4gdGhlIGVkaXRvciBoYXMgYmVlbiBibHVycmVkLiBQYXJ0IG9mIHRoZVxuXHQgKiBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIChodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSBpbnRlcmZhY2UuXG5cdCAqXG5cdCAqIE5vdGU6IFVuc2V0IHVubGVzcyB0aGUgY29tcG9uZW50IHVzZXMgdGhlIGBuZ01vZGVsYC5cblx0ICovXG5cdG9uVG91Y2hlZD86ICgpID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgZWRpdG9yIGNyZWF0ZWQgYnkgdGhpcyBjb21wb25lbnQuXG5cdCAqL1xuXHRpbnN0YW5jZTogYW55O1xuXG5cdC8qKlxuXHQgKiBJZiB0aGUgY29tcG9uZW50IGlzIHJlYWTigJNvbmx5IGJlZm9yZSB0aGUgZWRpdG9yIGluc3RhbmNlIGlzIGNyZWF0ZWQsIGl0IHJlbWVtYmVycyB0aGF0IHN0YXRlLFxuXHQgKiBzbyB0aGUgZWRpdG9yIGNhbiBiZWNvbWUgcmVhZOKAk29ubHkgb25jZSBpdCBpcyByZWFkeS5cblx0ICovXG5cdHByaXZhdGUgX3JlYWRPbmx5OiBib29sZWFuID0gbnVsbDtcblxuXHRwcml2YXRlIF9kYXRhOiBzdHJpbmcgPSBudWxsO1xuXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUgKSB7fVxuXG5cdG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcblx0XHRnZXRFZGl0b3JOYW1lc3BhY2UoIHRoaXMuZWRpdG9yVXJsLCBuYW1lc3BhY2UgPT4ge1xuXHRcdFx0dGhpcy5uYW1lc3BhY2VMb2FkZWQuZW1pdCggbmFtZXNwYWNlICk7XG5cdFx0fSApLnRoZW4oICgpID0+IHtcblx0XHRcdC8vIENoZWNrIGlmIGNvbXBvbmVudCBpbnN0YW5jZSB3YXMgZGVzdHJveWVkIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YCBjYWxsICgjMTEwKS5cblx0XHRcdC8vIEhlcmUsIGB0aGlzLmluc3RhbmNlYCBpcyBzdGlsbCBub3QgaW5pdGlhbGl6ZWQgYW5kIHNvIGFkZGl0aW9uYWwgZmxhZyBpcyBuZWVkZWQuXG5cdFx0XHRpZiAoIHRoaXMuX2Rlc3Ryb3llZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhciggdGhpcy5jcmVhdGVFZGl0b3IuYmluZCggdGhpcyApICk7XG5cdFx0fSApLmNhdGNoKCB3aW5kb3cuY29uc29sZS5lcnJvciApO1xuXHR9XG5cblx0bmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0dGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcblxuXHRcdHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCAoKSA9PiB7XG5cdFx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR0aGlzLmluc3RhbmNlID0gbnVsbDtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR3cml0ZVZhbHVlKCB2YWx1ZTogc3RyaW5nICk6IHZvaWQge1xuXHRcdHRoaXMuZGF0YSA9IHZhbHVlO1xuXHR9XG5cblx0cmVnaXN0ZXJPbkNoYW5nZSggY2FsbGJhY2s6ICggZGF0YTogc3RyaW5nICkgPT4gdm9pZCApOiB2b2lkIHtcblx0XHR0aGlzLm9uQ2hhbmdlID0gY2FsbGJhY2s7XG5cdH1cblxuXHRyZWdpc3Rlck9uVG91Y2hlZCggY2FsbGJhY2s6ICgpID0+IHZvaWQgKTogdm9pZCB7XG5cdFx0dGhpcy5vblRvdWNoZWQgPSBjYWxsYmFjaztcblx0fVxuXG5cdHByaXZhdGUgY3JlYXRlRWRpdG9yKCk6IHZvaWQge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0aGlzLnRhZ05hbWUgKTtcblx0XHR0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuXG5cdFx0Y29uc3QgdXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayA9IHRoaXMuY29uZmlnPy5vbj8uaW5zdGFuY2VSZWFkeTtcblx0XHRjb25zdCBkZWZhdWx0Q29uZmlnOiBQYXJ0aWFsPENLRWRpdG9yNC5Db25maWc+ID0ge1xuXHRcdFx0ZGVsYXlJZkRldGFjaGVkOiB0cnVlXG5cdFx0fTtcblx0XHRjb25zdCBjb25maWc6IFBhcnRpYWw8Q0tFZGl0b3I0LkNvbmZpZz4gPSB7IC4uLmRlZmF1bHRDb25maWcsIC4uLnRoaXMuY29uZmlnIH07XG5cblx0XHRpZiAoIHR5cGVvZiBjb25maWcub24gPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uZmlnLm9uID0ge307XG5cdFx0fVxuXG5cdFx0Y29uZmlnLm9uLmluc3RhbmNlUmVhZHkgPSBldnQgPT4ge1xuXHRcdFx0Y29uc3QgZWRpdG9yID0gZXZ0LmVkaXRvcjtcblxuXHRcdFx0dGhpcy5pbnN0YW5jZSA9IGVkaXRvcjtcblxuXHRcdFx0Ly8gUmVhZCBvbmx5IHN0YXRlIG1heSBjaGFuZ2UgZHVyaW5nIGluc3RhbmNlIGluaXRpYWxpemF0aW9uLlxuXHRcdFx0dGhpcy5yZWFkT25seSA9IHRoaXMuX3JlYWRPbmx5ICE9PSBudWxsID8gdGhpcy5fcmVhZE9ubHkgOiB0aGlzLmluc3RhbmNlLnJlYWRPbmx5O1xuXG5cdFx0XHR0aGlzLnN1YnNjcmliZSggdGhpcy5pbnN0YW5jZSApO1xuXG5cdFx0XHRjb25zdCB1bmRvID0gZWRpdG9yLnVuZG9NYW5hZ2VyO1xuXG5cdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gbnVsbCApIHtcblx0XHRcdFx0dW5kbyAmJiB1bmRvLmxvY2soKTtcblxuXHRcdFx0XHRlZGl0b3Iuc2V0RGF0YSggdGhpcy5kYXRhLCB7IGNhbGxiYWNrOiAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gTG9ja2luZyB1bmRvTWFuYWdlciBwcmV2ZW50cyAnY2hhbmdlJyBldmVudC5cblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGl0IG1hbnVhbGx5IHRvIHVwZGF0ZWQgYm91bmQgZGF0YS5cblx0XHRcdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gZWRpdG9yLmdldERhdGEoKSApIHtcblx0XHRcdFx0XHRcdHVuZG8gPyBlZGl0b3IuZmlyZSggJ2NoYW5nZScgKSA6IGVkaXRvci5maXJlKCAnZGF0YVJlYWR5JyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1bmRvICYmIHVuZG8udW5sb2NrKCk7XG5cblx0XHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0XHRcdGlmICggdHlwZW9mIHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRcdHVzZXJJbnN0YW5jZVJlYWR5Q2FsbGJhY2soIGV2dCApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0aGlzLnJlYWR5LmVtaXQoIGV2dCApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSB9ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0XHRpZiAoIHR5cGVvZiB1c2VySW5zdGFuY2VSZWFkeUNhbGxiYWNrID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0dXNlckluc3RhbmNlUmVhZHlDYWxsYmFjayggZXZ0ICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggdGhpcy50eXBlID09PSBDS0VkaXRvcjQuRWRpdG9yVHlwZS5JTkxJTkUgKSB7XG5cdFx0XHRDS0VESVRPUi5pbmxpbmUoIGVsZW1lbnQsIGNvbmZpZyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRDS0VESVRPUi5yZXBsYWNlKCBlbGVtZW50LCBjb25maWcgKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHN1YnNjcmliZSggZWRpdG9yOiBhbnkgKTogdm9pZCB7XG5cdFx0ZWRpdG9yLm9uKCAnZm9jdXMnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZm9jdXMuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAncGFzdGUnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGFzdGUuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYWZ0ZXJQYXN0ZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5hZnRlclBhc3RlLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdlbmQnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZHJhZ0VuZC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9KTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdzdGFydCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcmFnU3RhcnQuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJvcCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcm9wLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXF1ZXN0LmVtaXQoZXZ0KTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVzcG9uc2UnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZmlsZVVwbG9hZFJlc3BvbnNlLmVtaXQoZXZ0KTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdibHVyJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRpZiAoIHRoaXMub25Ub3VjaGVkICkge1xuXHRcdFx0XHRcdHRoaXMub25Ub3VjaGVkKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLmJsdXIuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZGF0YVJlYWR5JywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcblxuXHRcdGlmICggdGhpcy5pbnN0YW5jZS51bmRvTWFuYWdlciApIHtcblx0XHRcdGVkaXRvci5vbiggJ2NoYW5nZScsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cdFx0fVxuXHRcdC8vIElmICd1bmRvJyBwbHVnaW4gaXMgbm90IGxvYWRlZCwgbGlzdGVuIHRvICdzZWxlY3Rpb25DaGVjaycgZXZlbnQgaW5zdGVhZC4gKCM1NCkuXG5cdFx0ZWxzZSB7XG5cdFx0XHRlZGl0b3Iub24oICdzZWxlY3Rpb25DaGVjaycsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwcm9wYWdhdGVDaGFuZ2UoIGV2ZW50OiBhbnkgKTogdm9pZCB7XG5cdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdEYXRhID0gdGhpcy5pbnN0YW5jZS5nZXREYXRhKCk7XG5cblx0XHRcdGlmICggZXZlbnQubmFtZSA9PT0gJ2NoYW5nZScgKSB7XG5cdFx0XHRcdHRoaXMuY2hhbmdlLmVtaXQoIGV2ZW50ICk7XG5cdFx0XHR9IGVsc2UgaWYgKCBldmVudC5uYW1lID09PSAnZGF0YVJlYWR5JyApIHtcblx0XHRcdFx0dGhpcy5kYXRhUmVhZHkuZW1pdCggZXZlbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBuZXdEYXRhID09PSB0aGlzLmRhdGEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fZGF0YSA9IG5ld0RhdGE7XG5cdFx0XHR0aGlzLmRhdGFDaGFuZ2UuZW1pdCggbmV3RGF0YSApO1xuXG5cdFx0XHRpZiAoIHRoaXMub25DaGFuZ2UgKSB7XG5cdFx0XHRcdHRoaXMub25DaGFuZ2UoIG5ld0RhdGEgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxufVxuIl19