/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { Component, NgZone, Input, Output, EventEmitter, forwardRef, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from './ckeditor.helpers';
export class CKEditorComponent {
    constructor(elementRef, ngZone) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
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
        /**
         * CKEditor 4 script url address. Script will be loaded only if CKEDITOR namespace is missing.
         *
         * Defaults to 'https://cdn.ckeditor.com/4.16.0/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.16.0/standard-all/ckeditor.js';
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
        getEditorNamespace(this.editorUrl).then(() => {
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
    tagName: [{ type: Input }],
    type: [{ type: Input }],
    data: [{ type: Input }],
    readOnly: [{ type: Input }],
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
    blur: [{ type: Output }],
    editorUrl: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2Nrc291cmNlL1dvcmtzcGFjZS9DS0VkaXRvcjQvY2tlZGl0b3I0LWFuZ3VsYXIvc3JjL2NrZWRpdG9yLyIsInNvdXJjZXMiOlsiY2tlZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFDTixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBRVYsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUVOLGlCQUFpQixFQUNqQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBa0J4RCxNQUFNLE9BQU8saUJBQWlCO0lBb043QixZQUFxQixVQUFzQixFQUFVLE1BQWM7UUFBOUMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUEzTW5FOzs7O1dBSUc7UUFDTSxZQUFPLEdBQUcsVUFBVSxDQUFDO1FBRTlCOzs7Ozs7Ozs7V0FTRztRQUNNLFNBQUksMkJBQXNEO1FBb0RuRTs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTFEOzs7OztXQUtHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7Ozs7V0FNRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUzRDs7Ozs7V0FLRztRQUNPLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUvRDs7OztXQUlHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7O1dBSUc7UUFDTyxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFNUQ7Ozs7V0FJRztRQUNPLFNBQUksR0FB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LENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzdCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzFCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFFLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzVCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxNQUFN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O2lDQU9OLE1BQU07Z0NBT04sTUFBTTtvQkFPTixNQUFNO29CQVFOLE1BQU07eUJBT04sTUFBTTttQkFPTixNQUFNO3dCQXNDTixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMSwgQ0tTb3VyY2UgLSBGcmVkZXJpY28gS25hYmJlbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5cbmltcG9ydCB7XG5cdENvbXBvbmVudCxcblx0Tmdab25lLFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEVsZW1lbnRSZWYsXG5cdEFmdGVyVmlld0luaXQsIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcblx0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG5cdE5HX1ZBTFVFX0FDQ0VTU09SXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgZ2V0RWRpdG9yTmFtZXNwYWNlIH0gZnJvbSAnLi9ja2VkaXRvci5oZWxwZXJzJztcblxuaW1wb3J0IHsgQ0tFZGl0b3I0IH0gZnJvbSAnLi9ja2VkaXRvcic7XG5cbmRlY2xhcmUgbGV0IENLRURJVE9SOiBhbnk7XG5cbkBDb21wb25lbnQoIHtcblx0c2VsZWN0b3I6ICdja2VkaXRvcicsXG5cdHRlbXBsYXRlOiAnPG5nLXRlbXBsYXRlPjwvbmctdGVtcGxhdGU+JyxcblxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCAoKSA9PiBDS0VkaXRvckNvbXBvbmVudCApLFxuXHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0fVxuXHRdXG59IClcbmV4cG9ydCBjbGFzcyBDS0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXHQvKipcblx0ICogVGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGVkaXRvci5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfY29uZmlnLmh0bWxcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIGNvbmZpZz86IENLRWRpdG9yNC5Db25maWc7XG5cblx0LyoqXG5cdCAqIFRhZyBuYW1lIG9mIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCB0YWcgaXMgYHRleHRhcmVhYC5cblx0ICovXG5cdEBJbnB1dCgpIHRhZ05hbWUgPSAndGV4dGFyZWEnO1xuXG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZWRpdG9yIGludGVyZmFjZS5cblx0ICpcblx0ICogQnkgZGVmYXVsdCBlZGl0b3IgaW50ZXJmYWNlIHdpbGwgYmUgaW5pdGlhbGl6ZWQgYXMgYGNsYXNzaWNgIGVkaXRvci5cblx0ICogWW91IGNhbiBhbHNvIGNob29zZSB0byBjcmVhdGUgYW4gZWRpdG9yIHdpdGggYGlubGluZWAgaW50ZXJmYWNlIHR5cGUgaW5zdGVhZC5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9ndWlkZS9kZXZfdWl0eXBlcy5odG1sXG5cdCAqIGFuZCBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZXhhbXBsZXMvZml4ZWR1aS5odG1sXG5cdCAqIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSB0eXBlOiBDS0VkaXRvcjQuRWRpdG9yVHlwZSA9IENLRWRpdG9yNC5FZGl0b3JUeXBlLkNMQVNTSUM7XG5cblx0LyoqXG5cdCAqIEtlZXBzIHRyYWNrIG9mIHRoZSBlZGl0b3IncyBkYXRhLlxuXHQgKlxuXHQgKiBJdCdzIGFsc28gZGVjb3JhdGVkIGFzIGFuIGlucHV0IHdoaWNoIGlzIHVzZWZ1bCB3aGVuIG5vdCB1c2luZyB0aGUgbmdNb2RlbC5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvTmdNb2RlbCB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IGRhdGEoIGRhdGE6IHN0cmluZyApIHtcblx0XHRpZiAoIGRhdGEgPT09IHRoaXMuX2RhdGEgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0dGhpcy5pbnN0YW5jZS5zZXREYXRhKCBkYXRhICk7XG5cdFx0XHQvLyBEYXRhIG1heSBiZSBjaGFuZ2VkIGJ5IEFDRi5cblx0XHRcdHRoaXMuX2RhdGEgPSB0aGlzLmluc3RhbmNlLmdldERhdGEoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9kYXRhID0gZGF0YTtcblx0fVxuXG5cdGdldCBkYXRhKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGE7XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgZWRpdG9yIGJlY29tZXMgcmVhZC1vbmx5LlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNwcm9wZXJ0eS1yZWFkT25seVxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IHJlYWRPbmx5KCBpc1JlYWRPbmx5OiBib29sZWFuICkge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0UmVhZE9ubHkoIGlzUmVhZE9ubHkgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEZWxheSBzZXR0aW5nIHJlYWQtb25seSBzdGF0ZSB1bnRpbCBlZGl0b3IgaW5pdGlhbGl6YXRpb24uXG5cdFx0dGhpcy5fcmVhZE9ubHkgPSBpc1JlYWRPbmx5O1xuXHR9XG5cblx0Z2V0IHJlYWRPbmx5KCk6IGJvb2xlYW4ge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHJldHVybiB0aGlzLmluc3RhbmNlLnJlYWRPbmx5O1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9yZWFkT25seTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgaXMgcmVhZHkuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjaW5zdGFuY2VSZWFkeWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1pbnN0YW5jZVJlYWR5XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgZGF0YSBpcyBsb2FkZWQsIGUuZy4gYWZ0ZXIgY2FsbGluZyBzZXREYXRhKClcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNtZXRob2Qtc2V0RGF0YVxuXHQgKiBlZGl0b3IncyBtZXRob2QuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZGF0YVJlYWR5YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRhdGFSZWFkeSBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhUmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNjaGFuZ2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtY2hhbmdlXG5cdCAqIGV2ZW50LiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB0aGlzIGV2ZW50IG1heSBiZSBjYWxsZWQgZXZlbiB3aGVuIGRhdGEgZGlkbid0IHJlYWxseSBjaGFuZ2VkLlxuXHQgKiBQbGVhc2Ugbm90ZSB0aGF0IHRoaXMgZXZlbnQgd2lsbCBvbmx5IGJlIGZpcmVkIHdoZW4gYHVuZG9gIHBsdWdpbiBpcyBsb2FkZWQuIElmIHlvdSBuZWVkIHRvXG5cdCAqIGxpc3RlbiBmb3IgZWRpdG9yIGNoYW5nZXMgKGUuZy4gZm9yIHR3by13YXkgZGF0YSBiaW5kaW5nKSwgdXNlIGBkYXRhQ2hhbmdlYCBldmVudCBpbnN0ZWFkLlxuXHQgKi9cblx0QE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGhhcyBjaGFuZ2VkLiBJbiBjb250cmFzdCB0byBgY2hhbmdlYCAtIG9ubHkgZW1pdHMgd2hlblxuXHQgKiBkYXRhIHJlYWxseSBjaGFuZ2VkIHRodXMgY2FuIGJlIHN1Y2Nlc3NmdWxseSB1c2VkIHdpdGggYFtkYXRhXWAgYW5kIHR3byB3YXkgYFsoZGF0YSldYCBiaW5kaW5nLlxuXHQgKlxuXHQgKiBTZWUgbW9yZTogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL3RlbXBsYXRlLXN5bnRheCN0d28td2F5LWJpbmRpbmctLS1cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJhZ1N0YXJ0IGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnc3RhcnRgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJhZ3N0YXJ0XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyYWdFbmQgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RyYWdlbmRgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJhZ2VuZFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJvcCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJvcGBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kcm9wXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGRyb3AgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGZpbGUgbG9hZGVyIHJlc3BvbnNlIGlzIHJlY2VpdmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXNwb25zZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1maWxlVXBsb2FkUmVzcG9uc2Vcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZmlsZVVwbG9hZFJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBmaWxlIGxvYWRlciBzaG91bGQgc2VuZCBYSFIuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZmlsZVVwbG9hZFJlcXVlc3RgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlcXVlc3Rcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZmlsZVVwbG9hZFJlcXVlc3QgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgYXJlYSBvZiB0aGUgZWRpdG9yIGlzIGZvY3VzZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZm9jdXNgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZm9jdXNcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSB1c2VyIGluaXRpYXRlZCBhIHBhc3RlIGFjdGlvbiwgYnV0IGJlZm9yZSB0aGUgZGF0YSBpcyBpbnNlcnRlZC5cblx0ICogSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNwYXN0ZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1wYXN0ZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBwYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgYWZ0ZXIgdGhlIGBwYXN0ZWAgZXZlbnQgaWYgY29udGVudCB3YXMgbW9kaWZpZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYWZ0ZXJQYXN0ZWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1hZnRlclBhc3RlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGFmdGVyUGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGVkaXRpbmcgdmlldyBvZiB0aGUgZWRpdG9yIGlzIGJsdXJyZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjYmx1cmBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1ibHVyXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgZWRpdG9yIGNyZWF0ZWQgYnkgdGhpcyBjb21wb25lbnQuXG5cdCAqL1xuXHRpbnN0YW5jZTogYW55O1xuXG5cdC8qKlxuXHQgKiBJZiB0aGUgY29tcG9uZW50IGlzIHJlYWTigJNvbmx5IGJlZm9yZSB0aGUgZWRpdG9yIGluc3RhbmNlIGlzIGNyZWF0ZWQsIGl0IHJlbWVtYmVycyB0aGF0IHN0YXRlLFxuXHQgKiBzbyB0aGUgZWRpdG9yIGNhbiBiZWNvbWUgcmVhZOKAk29ubHkgb25jZSBpdCBpcyByZWFkeS5cblx0ICovXG5cdHByaXZhdGUgX3JlYWRPbmx5OiBib29sZWFuID0gbnVsbDtcblxuXHQvKipcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgY2hhbmdlcy4gUGFydCBvZiB0aGVcblx0ICogYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3NvcikgaW50ZXJmYWNlLlxuXHQgKlxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXG5cdCAqL1xuXHRvbkNoYW5nZT86ICggZGF0YTogc3RyaW5nICkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogQSBjYWxsYmFjayBleGVjdXRlZCB3aGVuIHRoZSBlZGl0b3IgaGFzIGJlZW4gYmx1cnJlZC4gUGFydCBvZiB0aGVcblx0ICogYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCAoaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9Db250cm9sVmFsdWVBY2Nlc3NvcikgaW50ZXJmYWNlLlxuXHQgKlxuXHQgKiBOb3RlOiBVbnNldCB1bmxlc3MgdGhlIGNvbXBvbmVudCB1c2VzIHRoZSBgbmdNb2RlbGAuXG5cdCAqL1xuXHRvblRvdWNoZWQ/OiAoKSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX2RhdGE6IHN0cmluZyA9IG51bGw7XG5cblx0cHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqIENLRWRpdG9yIDQgc2NyaXB0IHVybCBhZGRyZXNzLiBTY3JpcHQgd2lsbCBiZSBsb2FkZWQgb25seSBpZiBDS0VESVRPUiBuYW1lc3BhY2UgaXMgbWlzc2luZy5cblx0ICpcblx0ICogRGVmYXVsdHMgdG8gJ2h0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbS80LjE2LjAvc3RhbmRhcmQtYWxsL2NrZWRpdG9yLmpzJ1xuXHQgKi9cblx0QElucHV0KCkgZWRpdG9yVXJsID0gJ2h0dHBzOi8vY2RuLmNrZWRpdG9yLmNvbS80LjE2LjAvc3RhbmRhcmQtYWxsL2NrZWRpdG9yLmpzJztcblxuXHRjb25zdHJ1Y3RvciggcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIG5nWm9uZTogTmdab25lICkge1xuXHR9XG5cblx0bmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuXHRcdGdldEVkaXRvck5hbWVzcGFjZSggdGhpcy5lZGl0b3JVcmwgKS50aGVuKCAoKSA9PiB7XG5cdFx0XHQvLyBDaGVjayBpZiBjb21wb25lbnQgaW5zdGFuY2Ugd2FzIGRlc3Ryb3llZCBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAgY2FsbCAoIzExMCkuXG5cdFx0XHQvLyBIZXJlLCBgdGhpcy5pbnN0YW5jZWAgaXMgc3RpbGwgbm90IGluaXRpYWxpemVkIGFuZCBzbyBhZGRpdGlvbmFsIGZsYWcgaXMgbmVlZGVkLlxuXHRcdFx0aWYgKCB0aGlzLl9kZXN0cm95ZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoIHRoaXMuY3JlYXRlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHRcdH0gKS5jYXRjaCggd2luZG93LmNvbnNvbGUuZXJyb3IgKTtcblx0fVxuXG5cdG5nT25EZXN0cm95KCk6IHZvaWQge1xuXHRcdHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG5cblx0XHR0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhciggKCkgPT4ge1xuXHRcdFx0aWYgKCB0aGlzLmluc3RhbmNlICkge1xuXHRcdFx0XHR0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0dGhpcy5pbnN0YW5jZSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0d3JpdGVWYWx1ZSggdmFsdWU6IHN0cmluZyApOiB2b2lkIHtcblx0XHR0aGlzLmRhdGEgPSB2YWx1ZTtcblx0fVxuXG5cdHJlZ2lzdGVyT25DaGFuZ2UoIGNhbGxiYWNrOiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQgKTogdm9pZCB7XG5cdFx0dGhpcy5vbkNoYW5nZSA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cmVnaXN0ZXJPblRvdWNoZWQoIGNhbGxiYWNrOiAoKSA9PiB2b2lkICk6IHZvaWQge1xuXHRcdHRoaXMub25Ub3VjaGVkID0gY2FsbGJhY2s7XG5cdH1cblxuXHRwcml2YXRlIGNyZWF0ZUVkaXRvcigpOiB2b2lkIHtcblx0XHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggdGhpcy50YWdOYW1lICk7XG5cdFx0dGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcblxuXHRcdGNvbnN0IGluc3RhbmNlOiBDS0VkaXRvcjQuRWRpdG9yID0gdGhpcy50eXBlID09PSBDS0VkaXRvcjQuRWRpdG9yVHlwZS5JTkxJTkVcblx0XHRcdD8gQ0tFRElUT1IuaW5saW5lKCBlbGVtZW50LCB0aGlzLmNvbmZpZyApXG5cdFx0XHQ6IENLRURJVE9SLnJlcGxhY2UoIGVsZW1lbnQsIHRoaXMuY29uZmlnICk7XG5cblx0XHRpbnN0YW5jZS5vbmNlKCAnaW5zdGFuY2VSZWFkeScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cblx0XHRcdC8vIFJlYWQgb25seSBzdGF0ZSBtYXkgY2hhbmdlIGR1cmluZyBpbnN0YW5jZSBpbml0aWFsaXphdGlvbi5cblx0XHRcdHRoaXMucmVhZE9ubHkgPSB0aGlzLl9yZWFkT25seSAhPT0gbnVsbCA/IHRoaXMuX3JlYWRPbmx5IDogdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcblxuXHRcdFx0dGhpcy5zdWJzY3JpYmUoIHRoaXMuaW5zdGFuY2UgKTtcblxuXHRcdFx0Y29uc3QgdW5kbyA9IGluc3RhbmNlLnVuZG9NYW5hZ2VyO1xuXG5cdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gbnVsbCApIHtcblx0XHRcdFx0dW5kbyAmJiB1bmRvLmxvY2soKTtcblxuXHRcdFx0XHRpbnN0YW5jZS5zZXREYXRhKCB0aGlzLmRhdGEsIHsgY2FsbGJhY2s6ICgpID0+IHtcblx0XHRcdFx0XHQvLyBMb2NraW5nIHVuZG9NYW5hZ2VyIHByZXZlbnRzICdjaGFuZ2UnIGV2ZW50LlxuXHRcdFx0XHRcdC8vIFRyaWdnZXIgaXQgbWFudWFsbHkgdG8gdXBkYXRlZCBib3VuZCBkYXRhLlxuXHRcdFx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBpbnN0YW5jZS5nZXREYXRhKCkgKSB7XG5cdFx0XHRcdFx0XHR1bmRvID8gaW5zdGFuY2UuZmlyZSggJ2NoYW5nZScgKSA6IGluc3RhbmNlLmZpcmUoICdkYXRhUmVhZHknICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVuZG8gJiYgdW5kby51bmxvY2soKTtcblxuXHRcdFx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gfSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHByaXZhdGUgc3Vic2NyaWJlKCBlZGl0b3I6IGFueSApOiB2b2lkIHtcblx0XHRlZGl0b3Iub24oICdmb2N1cycsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5mb2N1cy5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdwYXN0ZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5wYXN0ZS5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdhZnRlclBhc3RlJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmFmdGVyUGFzdGUuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJhZ2VuZCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcmFnRW5kLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0pO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJhZ3N0YXJ0JywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRyYWdTdGFydC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdkcm9wJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRyb3AuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZmlsZVVwbG9hZFJlcXVlc3QnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZmlsZVVwbG9hZFJlcXVlc3QuZW1pdChldnQpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXNwb25zZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXNwb25zZS5lbWl0KGV2dCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYmx1cicsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0aWYgKCB0aGlzLm9uVG91Y2hlZCApIHtcblx0XHRcdFx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5ibHVyLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RhdGFSZWFkeScsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UudW5kb01hbmFnZXIgKSB7XG5cdFx0XHRlZGl0b3Iub24oICdjaGFuZ2UnLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0XHQvLyBJZiAndW5kbycgcGx1Z2luIGlzIG5vdCBsb2FkZWQsIGxpc3RlbiB0byAnc2VsZWN0aW9uQ2hlY2snIGV2ZW50IGluc3RlYWQuICgjNTQpLlxuXHRcdGVsc2Uge1xuXHRcdFx0ZWRpdG9yLm9uKCAnc2VsZWN0aW9uQ2hlY2snLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcHJvcGFnYXRlQ2hhbmdlKCBldmVudDogYW55ICk6IHZvaWQge1xuXHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3RGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXG5cdFx0XHRpZiAoIGV2ZW50Lm5hbWUgPT09ICdjaGFuZ2UnICkge1xuXHRcdFx0XHR0aGlzLmNoYW5nZS5lbWl0KCBldmVudCApO1xuXHRcdFx0fSBlbHNlIGlmICggZXZlbnQubmFtZSA9PT0gJ2RhdGFSZWFkeScgKSB7XG5cdFx0XHRcdHRoaXMuZGF0YVJlYWR5LmVtaXQoIGV2ZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbmV3RGF0YSA9PT0gdGhpcy5kYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2RhdGEgPSBuZXdEYXRhO1xuXHRcdFx0dGhpcy5kYXRhQ2hhbmdlLmVtaXQoIG5ld0RhdGEgKTtcblxuXHRcdFx0aWYgKCB0aGlzLm9uQ2hhbmdlICkge1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlKCBuZXdEYXRhICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cbn1cbiJdfQ==