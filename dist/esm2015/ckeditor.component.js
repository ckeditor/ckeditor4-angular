/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
var CKEditorComponent_1;
import * as tslib_1 from "tslib";
import { Component, NgZone, Input, Output, EventEmitter, forwardRef, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from './ckeditor.helpers';
let CKEditorComponent = CKEditorComponent_1 = class CKEditorComponent {
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
         * Defaults to 'https://cdn.ckeditor.com/4.15.0/standard-all/ckeditor.js'
         */
        this.editorUrl = 'https://cdn.ckeditor.com/4.15.0/standard-all/ckeditor.js';
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
};
CKEditorComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "config", void 0);
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "tagName", void 0);
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "type", void 0);
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "data", null);
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "readOnly", null);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "ready", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "dataReady", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "change", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "dataChange", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "dragStart", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "dragEnd", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "drop", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "fileUploadResponse", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "fileUploadRequest", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "focus", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "paste", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "afterPaste", void 0);
tslib_1.__decorate([
    Output()
], CKEditorComponent.prototype, "blur", void 0);
tslib_1.__decorate([
    Input()
], CKEditorComponent.prototype, "editorUrl", void 0);
CKEditorComponent = CKEditorComponent_1 = tslib_1.__decorate([
    Component({
        selector: 'ckeditor',
        template: '<ng-template></ng-template>',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CKEditorComponent_1),
                multi: true,
            }
        ]
    })
], CKEditorComponent);
export { CKEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2tlZGl0b3I0LWFuZ3VsYXIvIiwic291cmNlcyI6WyJja2VkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOzs7QUFFSCxPQUFPLEVBQ04sU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsVUFBVSxFQUNWLGFBQWEsRUFBRSxTQUFTLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTixpQkFBaUIsRUFDakIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQWtCeEQsSUFBYSxpQkFBaUIseUJBQTlCLE1BQWEsaUJBQWlCO0lBb043QixZQUFxQixVQUFzQixFQUFVLE1BQWM7UUFBOUMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUEzTW5FOzs7O1dBSUc7UUFDTSxZQUFPLEdBQUcsVUFBVSxDQUFDO1FBRTlCOzs7Ozs7Ozs7V0FTRztRQUNNLFNBQUksMkJBQXNEO1FBb0RuRTs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTFEOzs7OztXQUtHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7Ozs7V0FNRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUzRDs7Ozs7V0FLRztRQUNPLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUvRDs7OztXQUlHO1FBQ08sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTlEOzs7O1dBSUc7UUFDTyxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFNUQ7Ozs7V0FJRztRQUNPLFNBQUksR0FBRyxJQUFJ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SUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzdCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzFCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFFLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQzVCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBRSxHQUFHLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFFLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxDQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMs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O0FBTy9DO0lBQVQsTUFBTSxFQUFFOzZEQUE4RDtBQU83RDtJQUFULE1BQU0sRUFBRTs0REFBNkQ7QUFPNUQ7SUFBVCxNQUFNLEVBQUU7Z0RBQWlEO0FBUWhEO0lBQVQsTUFBTSxFQUFFO2dEQUFpRDtBQU9oRDtJQUFULE1BQU0sRUFBRTtxREFBc0Q7QUFPckQ7SUFBVCxNQUFNLEVBQUU7K0NBQWdEO0FBc0NoRDtJQUFSLEtBQUssRUFBRTtvREFBd0U7QUFsTnBFLGlCQUFpQjtJQVo3QixTQUFTLENBQUU7UUFDWCxRQUFRLEVBQUUsVUFBVTtRQUNwQixRQUFRLEVBQUUsNkJBQTZCO1FBRXZDLFNBQVMsRUFBRTtZQUNWO2dCQUNDLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUUsR0FBRyxFQUFFLENBQUMsbUJBQWlCLENBQUU7Z0JBQ2xELEtBQUssRUFBRSxJQUFJO2FBQ1g7U0FDRDtLQUNELENBQUU7R0FDVSxpQkFBaUIsQ0FnWTdCO1NBaFlZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDAzLTIwMjAsIENLU291cmNlIC0gRnJlZGVyaWNvIEtuYWJiZW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBGb3IgbGljZW5zaW5nLCBzZWUgTElDRU5TRS5tZC5cbiAqL1xuXG5pbXBvcnQge1xuXHRDb21wb25lbnQsXG5cdE5nWm9uZSxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0RXZlbnRFbWl0dGVyLFxuXHRmb3J3YXJkUmVmLFxuXHRFbGVtZW50UmVmLFxuXHRBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG5cdENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuXHROR19WQUxVRV9BQ0NFU1NPUlxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IGdldEVkaXRvck5hbWVzcGFjZSB9IGZyb20gJy4vY2tlZGl0b3IuaGVscGVycyc7XG5cbmltcG9ydCB7IENLRWRpdG9yNCB9IGZyb20gJy4vY2tlZGl0b3InO1xuXG5kZWNsYXJlIGxldCBDS0VESVRPUjogYW55O1xuXG5AQ29tcG9uZW50KCB7XG5cdHNlbGVjdG9yOiAnY2tlZGl0b3InLFxuXHR0ZW1wbGF0ZTogJzxuZy10ZW1wbGF0ZT48L25nLXRlbXBsYXRlPicsXG5cblx0cHJvdmlkZXJzOiBbXG5cdFx0e1xuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZiggKCkgPT4gQ0tFZGl0b3JDb21wb25lbnQgKSxcblx0XHRcdG11bHRpOiB0cnVlLFxuXHRcdH1cblx0XVxufSApXG5leHBvcnQgY2xhc3MgQ0tFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblx0LyoqXG5cdCAqIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBlZGl0b3IuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2NvbmZpZy5odG1sXG5cdCAqIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSBjb25maWc/OiBDS0VkaXRvcjQuQ29uZmlnO1xuXG5cdC8qKlxuXHQgKiBUYWcgbmFtZSBvZiB0aGUgZWRpdG9yIGNvbXBvbmVudC5cblx0ICpcblx0ICogVGhlIGRlZmF1bHQgdGFnIGlzIGB0ZXh0YXJlYWAuXG5cdCAqL1xuXHRASW5wdXQoKSB0YWdOYW1lID0gJ3RleHRhcmVhJztcblxuXHQvKipcblx0ICogVGhlIHR5cGUgb2YgdGhlIGVkaXRvciBpbnRlcmZhY2UuXG5cdCAqXG5cdCAqIEJ5IGRlZmF1bHQgZWRpdG9yIGludGVyZmFjZSB3aWxsIGJlIGluaXRpYWxpemVkIGFzIGBjbGFzc2ljYCBlZGl0b3IuXG5cdCAqIFlvdSBjYW4gYWxzbyBjaG9vc2UgdG8gY3JlYXRlIGFuIGVkaXRvciB3aXRoIGBpbmxpbmVgIGludGVyZmFjZSB0eXBlIGluc3RlYWQuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvZ3VpZGUvZGV2X3VpdHlwZXMuaHRtbFxuXHQgKiBhbmQgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2V4YW1wbGVzL2ZpeGVkdWkuaHRtbFxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgdHlwZTogQ0tFZGl0b3I0LkVkaXRvclR5cGUgPSBDS0VkaXRvcjQuRWRpdG9yVHlwZS5DTEFTU0lDO1xuXG5cdC8qKlxuXHQgKiBLZWVwcyB0cmFjayBvZiB0aGUgZWRpdG9yJ3MgZGF0YS5cblx0ICpcblx0ICogSXQncyBhbHNvIGRlY29yYXRlZCBhcyBhbiBpbnB1dCB3aGljaCBpcyB1c2VmdWwgd2hlbiBub3QgdXNpbmcgdGhlIG5nTW9kZWwuXG5cdCAqXG5cdCAqIFNlZSBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL05nTW9kZWwgdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHNldCBkYXRhKCBkYXRhOiBzdHJpbmcgKSB7XG5cdFx0aWYgKCBkYXRhID09PSB0aGlzLl9kYXRhICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0RGF0YSggZGF0YSApO1xuXHRcdFx0Ly8gRGF0YSBtYXkgYmUgY2hhbmdlZCBieSBBQ0YuXG5cdFx0XHR0aGlzLl9kYXRhID0gdGhpcy5pbnN0YW5jZS5nZXREYXRhKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fZGF0YSA9IGRhdGE7XG5cdH1cblxuXHRnZXQgZGF0YSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIGVkaXRvciBiZWNvbWVzIHJlYWQtb25seS5cblx0ICpcblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjcHJvcGVydHktcmVhZE9ubHlcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHNldCByZWFkT25seSggaXNSZWFkT25seTogYm9vbGVhbiApIHtcblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlLnNldFJlYWRPbmx5KCBpc1JlYWRPbmx5ICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gRGVsYXkgc2V0dGluZyByZWFkLW9ubHkgc3RhdGUgdW50aWwgZWRpdG9yIGluaXRpYWxpemF0aW9uLlxuXHRcdHRoaXMuX3JlYWRPbmx5ID0gaXNSZWFkT25seTtcblx0fVxuXG5cdGdldCByZWFkT25seSgpOiBib29sZWFuIHtcblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVhZE9ubHk7XG5cdH1cblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGlzIHJlYWR5LiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2luc3RhbmNlUmVhZHlgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtaW5zdGFuY2VSZWFkeVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZWRpdG9yIGRhdGEgaXMgbG9hZGVkLCBlLmcuIGFmdGVyIGNhbGxpbmcgc2V0RGF0YSgpXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjbWV0aG9kLXNldERhdGFcblx0ICogZWRpdG9yJ3MgbWV0aG9kLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2RhdGFSZWFkeWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1kYXRhUmVhZHkgZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZGF0YVJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBjb250ZW50IG9mIHRoZSBlZGl0b3IgaGFzIGNoYW5nZWQuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjY2hhbmdlYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWNoYW5nZVxuXHQgKiBldmVudC4gRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMgdGhpcyBldmVudCBtYXkgYmUgY2FsbGVkIGV2ZW4gd2hlbiBkYXRhIGRpZG4ndCByZWFsbHkgY2hhbmdlZC5cblx0ICogUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGV2ZW50IHdpbGwgb25seSBiZSBmaXJlZCB3aGVuIGB1bmRvYCBwbHVnaW4gaXMgbG9hZGVkLiBJZiB5b3UgbmVlZCB0b1xuXHQgKiBsaXN0ZW4gZm9yIGVkaXRvciBjaGFuZ2VzIChlLmcuIGZvciB0d28td2F5IGRhdGEgYmluZGluZyksIHVzZSBgZGF0YUNoYW5nZWAgZXZlbnQgaW5zdGVhZC5cblx0ICovXG5cdEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSW4gY29udHJhc3QgdG8gYGNoYW5nZWAgLSBvbmx5IGVtaXRzIHdoZW5cblx0ICogZGF0YSByZWFsbHkgY2hhbmdlZCB0aHVzIGNhbiBiZSBzdWNjZXNzZnVsbHkgdXNlZCB3aXRoIGBbZGF0YV1gIGFuZCB0d28gd2F5IGBbKGRhdGEpXWAgYmluZGluZy5cblx0ICpcblx0ICogU2VlIG1vcmU6IGh0dHBzOi8vYW5ndWxhci5pby9ndWlkZS90ZW1wbGF0ZS1zeW50YXgjdHdvLXdheS1iaW5kaW5nLS0tXG5cdCAqL1xuXHRAT3V0cHV0KCkgZGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyYWdTdGFydCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJhZ3N0YXJ0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdzdGFydFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcmFnRW5kIGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnZW5kYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdlbmRcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyb3AgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2Ryb3BgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJvcFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcm9wID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBmaWxlIGxvYWRlciByZXNwb25zZSBpcyByZWNlaXZlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmaWxlVXBsb2FkUmVzcG9uc2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlc3BvbnNlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgc2hvdWxkIHNlbmQgWEhSLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXF1ZXN0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXF1ZXN0XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXF1ZXN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIGFyZWEgb2YgdGhlIGVkaXRvciBpcyBmb2N1c2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZvY3VzYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZvY3VzXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyBhZnRlciB0aGUgdXNlciBpbml0aWF0ZWQgYSBwYXN0ZSBhY3Rpb24sIGJ1dCBiZWZvcmUgdGhlIGRhdGEgaXMgaW5zZXJ0ZWQuXG5cdCAqIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjcGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtcGFzdGVcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgcGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSBgcGFzdGVgIGV2ZW50IGlmIGNvbnRlbnQgd2FzIG1vZGlmaWVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2FmdGVyUGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYWZ0ZXJQYXN0ZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBhZnRlclBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIHZpZXcgb2YgdGhlIGVkaXRvciBpcyBibHVycmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2JsdXJgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYmx1clxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGVkaXRvciBjcmVhdGVkIGJ5IHRoaXMgY29tcG9uZW50LlxuXHQgKi9cblx0aW5zdGFuY2U6IGFueTtcblxuXHQvKipcblx0ICogSWYgdGhlIGNvbXBvbmVudCBpcyByZWFk4oCTb25seSBiZWZvcmUgdGhlIGVkaXRvciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBpdCByZW1lbWJlcnMgdGhhdCBzdGF0ZSxcblx0ICogc28gdGhlIGVkaXRvciBjYW4gYmVjb21lIHJlYWTigJNvbmx5IG9uY2UgaXQgaXMgcmVhZHkuXG5cdCAqL1xuXHRwcml2YXRlIF9yZWFkT25seTogYm9vbGVhbiA9IG51bGw7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGNoYW5nZXMuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25DaGFuZ2U/OiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgZWRpdG9yIGhhcyBiZWVuIGJsdXJyZWQuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25Ub3VjaGVkPzogKCkgPT4gdm9pZDtcblxuXHRwcml2YXRlIF9kYXRhOiBzdHJpbmcgPSBudWxsO1xuXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBDS0VkaXRvciA0IHNjcmlwdCB1cmwgYWRkcmVzcy4gU2NyaXB0IHdpbGwgYmUgbG9hZGVkIG9ubHkgaWYgQ0tFRElUT1IgbmFtZXNwYWNlIGlzIG1pc3NpbmcuXG5cdCAqXG5cdCAqIERlZmF1bHRzIHRvICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4xNS4wL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcydcblx0ICovXG5cdEBJbnB1dCgpIGVkaXRvclVybCA9ICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4xNS4wL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcyc7XG5cblx0Y29uc3RydWN0b3IoIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSApIHtcblx0fVxuXG5cdG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcblx0XHRnZXRFZGl0b3JOYW1lc3BhY2UoIHRoaXMuZWRpdG9yVXJsICkudGhlbiggKCkgPT4ge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgY29tcG9uZW50IGluc3RhbmNlIHdhcyBkZXN0cm95ZWQgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGwgKCMxMTApLlxuXHRcdFx0Ly8gSGVyZSwgYHRoaXMuaW5zdGFuY2VgIGlzIHN0aWxsIG5vdCBpbml0aWFsaXplZCBhbmQgc28gYWRkaXRpb25hbCBmbGFnIGlzIG5lZWRlZC5cblx0XHRcdGlmICggdGhpcy5fZGVzdHJveWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCB0aGlzLmNyZWF0ZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0XHR9ICkuY2F0Y2goIHdpbmRvdy5jb25zb2xlLmVycm9yICk7XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpOiB2b2lkIHtcblx0XHR0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXG5cdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoICgpID0+IHtcblx0XHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdFx0dGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUoIHZhbHVlOiBzdHJpbmcgKTogdm9pZCB7XG5cdFx0dGhpcy5kYXRhID0gdmFsdWU7XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKCBjYWxsYmFjazogKCBkYXRhOiBzdHJpbmcgKSA9PiB2b2lkICk6IHZvaWQge1xuXHRcdHRoaXMub25DaGFuZ2UgPSBjYWxsYmFjaztcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKCBjYWxsYmFjazogKCkgPT4gdm9pZCApOiB2b2lkIHtcblx0XHR0aGlzLm9uVG91Y2hlZCA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVFZGl0b3IoKTogdm9pZCB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRoaXMudGFnTmFtZSApO1xuXHRcdHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XG5cblx0XHRjb25zdCBpbnN0YW5jZTogQ0tFZGl0b3I0LkVkaXRvciA9IHRoaXMudHlwZSA9PT0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuSU5MSU5FXG5cdFx0XHQ/IENLRURJVE9SLmlubGluZSggZWxlbWVudCwgdGhpcy5jb25maWcgKVxuXHRcdFx0OiBDS0VESVRPUi5yZXBsYWNlKCBlbGVtZW50LCB0aGlzLmNvbmZpZyApO1xuXG5cdFx0aW5zdGFuY2Uub25jZSggJ2luc3RhbmNlUmVhZHknLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuXG5cdFx0XHQvLyBSZWFkIG9ubHkgc3RhdGUgbWF5IGNoYW5nZSBkdXJpbmcgaW5zdGFuY2UgaW5pdGlhbGl6YXRpb24uXG5cdFx0XHR0aGlzLnJlYWRPbmx5ID0gdGhpcy5fcmVhZE9ubHkgIT09IG51bGwgPyB0aGlzLl9yZWFkT25seSA6IHRoaXMuaW5zdGFuY2UucmVhZE9ubHk7XG5cblx0XHRcdHRoaXMuc3Vic2NyaWJlKCB0aGlzLmluc3RhbmNlICk7XG5cblx0XHRcdGNvbnN0IHVuZG8gPSBpbnN0YW5jZS51bmRvTWFuYWdlcjtcblxuXHRcdFx0aWYgKCB0aGlzLmRhdGEgIT09IG51bGwgKSB7XG5cdFx0XHRcdHVuZG8gJiYgdW5kby5sb2NrKCk7XG5cblx0XHRcdFx0aW5zdGFuY2Uuc2V0RGF0YSggdGhpcy5kYXRhLCB7IGNhbGxiYWNrOiAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gTG9ja2luZyB1bmRvTWFuYWdlciBwcmV2ZW50cyAnY2hhbmdlJyBldmVudC5cblx0XHRcdFx0XHQvLyBUcmlnZ2VyIGl0IG1hbnVhbGx5IHRvIHVwZGF0ZWQgYm91bmQgZGF0YS5cblx0XHRcdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gaW5zdGFuY2UuZ2V0RGF0YSgpICkge1xuXHRcdFx0XHRcdFx0dW5kbyA/IGluc3RhbmNlLmZpcmUoICdjaGFuZ2UnICkgOiBpbnN0YW5jZS5maXJlKCAnZGF0YVJlYWR5JyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1bmRvICYmIHVuZG8udW5sb2NrKCk7XG5cblx0XHRcdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9IH0gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMucmVhZHkuZW1pdCggZXZ0ICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRwcml2YXRlIHN1YnNjcmliZSggZWRpdG9yOiBhbnkgKTogdm9pZCB7XG5cdFx0ZWRpdG9yLm9uKCAnZm9jdXMnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZm9jdXMuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAncGFzdGUnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGFzdGUuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYWZ0ZXJQYXN0ZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5hZnRlclBhc3RlLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdlbmQnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZHJhZ0VuZC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9KTtcblxuXHRcdGVkaXRvci5vbiggJ2RyYWdzdGFydCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcmFnU3RhcnQuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJvcCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcm9wLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXF1ZXN0JywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXF1ZXN0LmVtaXQoZXZ0KTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdmaWxlVXBsb2FkUmVzcG9uc2UnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcblx0XHRcdFx0dGhpcy5maWxlVXBsb2FkUmVzcG9uc2UuZW1pdChldnQpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2JsdXInLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdGlmICggdGhpcy5vblRvdWNoZWQgKSB7XG5cdFx0XHRcdFx0dGhpcy5vblRvdWNoZWQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuYmx1ci5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdkYXRhUmVhZHknLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXG5cdFx0aWYgKCB0aGlzLmluc3RhbmNlLnVuZG9NYW5hZ2VyICkge1xuXHRcdFx0ZWRpdG9yLm9uKCAnY2hhbmdlJywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcblx0XHR9XG5cdFx0Ly8gSWYgJ3VuZG8nIHBsdWdpbiBpcyBub3QgbG9hZGVkLCBsaXN0ZW4gdG8gJ3NlbGVjdGlvbkNoZWNrJyBldmVudCBpbnN0ZWFkLiAoIzU0KS5cblx0XHRlbHNlIHtcblx0XHRcdGVkaXRvci5vbiggJ3NlbGVjdGlvbkNoZWNrJywgdGhpcy5wcm9wYWdhdGVDaGFuZ2UsIHRoaXMgKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHByb3BhZ2F0ZUNoYW5nZSggZXZlbnQ6IGFueSApOiB2b2lkIHtcblx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdGNvbnN0IG5ld0RhdGEgPSB0aGlzLmluc3RhbmNlLmdldERhdGEoKTtcblxuXHRcdFx0aWYgKCBldmVudC5uYW1lID09PSAnY2hhbmdlJyApIHtcblx0XHRcdFx0dGhpcy5jaGFuZ2UuZW1pdCggZXZlbnQgKTtcblx0XHRcdH0gZWxzZSBpZiAoIGV2ZW50Lm5hbWUgPT09ICdkYXRhUmVhZHknICkge1xuXHRcdFx0XHR0aGlzLmRhdGFSZWFkeS5lbWl0KCBldmVudCApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG5ld0RhdGEgPT09IHRoaXMuZGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9kYXRhID0gbmV3RGF0YTtcblx0XHRcdHRoaXMuZGF0YUNoYW5nZS5lbWl0KCBuZXdEYXRhICk7XG5cblx0XHRcdGlmICggdGhpcy5vbkNoYW5nZSApIHtcblx0XHRcdFx0dGhpcy5vbkNoYW5nZSggbmV3RGF0YSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG59XG4iXX0=