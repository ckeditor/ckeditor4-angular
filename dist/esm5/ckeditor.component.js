/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import * as tslib_1 from "tslib";
import { Component, NgZone, Input, Output, EventEmitter, forwardRef, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { getEditorNamespace } from './ckeditor.helpers';
var CKEditorComponent = /** @class */ (function () {
    function CKEditorComponent(elementRef, ngZone) {
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
         * By default editor interface will be initialized as `divarea` editor which is an inline editor with fixed UI.
         * You can change interface type by choosing between `divarea` and `inline` editor interface types.
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
         * Fires when the native drop event occurs. It corresponds with the `editor#dragstart`
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
         * event.
         */
        this.dragStart = new EventEmitter();
        /**
         * Fires when the native drop event occurs. It corresponds with the `editor#dragend`
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
         * Fires when the editing view of the editor is focused. It corresponds with the `editor#focus`
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
    CKEditorComponent_1 = CKEditorComponent;
    Object.defineProperty(CKEditorComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        /**
         * Keeps track of the editor's data.
         *
         * It's also decorated as an input which is useful when not using the ngModel.
         *
         * See https://angular.io/api/forms/NgModel to learn more.
         */
        set: function (data) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CKEditorComponent.prototype, "readOnly", {
        get: function () {
            if (this.instance) {
                return this.instance.readOnly;
            }
            return this._readOnly;
        },
        /**
         * When set `true`, the editor becomes read-only.
         * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
         * to learn more.
         */
        set: function (isReadOnly) {
            if (this.instance) {
                this.instance.setReadOnly(isReadOnly);
                return;
            }
            // Delay setting read-only state until editor initialization.
            this._readOnly = isReadOnly;
        },
        enumerable: true,
        configurable: true
    });
    CKEditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        getEditorNamespace(this.editorUrl).then(function () {
            // Check if component instance was destroyed before `ngAfterViewInit` call (#110).
            // Here, `this.instance` is still not initialized and so additional flag is needed.
            if (_this._destroyed) {
                return;
            }
            _this.ngZone.runOutsideAngular(_this.createEditor.bind(_this));
        }).catch(window.console.error);
    };
    CKEditorComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        this._destroyed = true;
        this.ngZone.runOutsideAngular(function () {
            if (_this.instance) {
                _this.instance.destroy();
                _this.instance = null;
            }
        });
    };
    CKEditorComponent.prototype.writeValue = function (value) {
        this.data = value;
    };
    CKEditorComponent.prototype.registerOnChange = function (callback) {
        this.onChange = callback;
    };
    CKEditorComponent.prototype.registerOnTouched = function (callback) {
        this.onTouched = callback;
    };
    CKEditorComponent.prototype.createEditor = function () {
        var _this = this;
        var element = document.createElement(this.tagName);
        this.elementRef.nativeElement.appendChild(element);
        if (this.type === "divarea" /* DIVAREA */) {
            this.config = this.ensureDivareaPlugin(this.config || {});
        }
        var instance = this.type === "inline" /* INLINE */
            ? CKEDITOR.inline(element, this.config)
            : CKEDITOR.replace(element, this.config);
        instance.once('instanceReady', function (evt) {
            _this.instance = instance;
            // Read only state may change during instance initialization.
            _this.readOnly = _this._readOnly !== null ? _this._readOnly : _this.instance.readOnly;
            _this.subscribe(_this.instance);
            var undo = instance.undoManager;
            if (_this.data !== null) {
                undo && undo.lock();
                instance.setData(_this.data, { callback: function () {
                        // Locking undoManager prevents 'change' event.
                        // Trigger it manually to updated bound data.
                        if (_this.data !== instance.getData()) {
                            undo ? instance.fire('change') : instance.fire('dataReady');
                        }
                        undo && undo.unlock();
                        _this.ngZone.run(function () {
                            _this.ready.emit(evt);
                        });
                    } });
            }
            else {
                _this.ngZone.run(function () {
                    _this.ready.emit(evt);
                });
            }
        });
    };
    CKEditorComponent.prototype.subscribe = function (editor) {
        var _this = this;
        editor.on('focus', function (evt) {
            _this.ngZone.run(function () {
                _this.focus.emit(evt);
            });
        });
        editor.on('paste', function (evt) {
            _this.ngZone.run(function () {
                _this.paste.emit(evt);
            });
        });
        editor.on('afterPaste', function (evt) {
            _this.ngZone.run(function () {
                _this.afterPaste.emit(evt);
            });
        });
        editor.on('dragend', function (evt) {
            _this.ngZone.run(function () {
                _this.dragEnd.emit(evt);
            });
        });
        editor.on('dragstart', function (evt) {
            _this.ngZone.run(function () {
                _this.dragStart.emit(evt);
            });
        });
        editor.on('drop', function (evt) {
            _this.ngZone.run(function () {
                _this.drop.emit(evt);
            });
        });
        editor.on('fileUploadRequest', function (evt) {
            _this.ngZone.run(function () {
                _this.fileUploadRequest.emit(evt);
            });
        });
        editor.on('fileUploadResponse', function (evt) {
            _this.ngZone.run(function () {
                _this.fileUploadResponse.emit(evt);
            });
        });
        editor.on('blur', function (evt) {
            _this.ngZone.run(function () {
                if (_this.onTouched) {
                    _this.onTouched();
                }
                _this.blur.emit(evt);
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
    };
    CKEditorComponent.prototype.propagateChange = function (event) {
        var _this = this;
        this.ngZone.run(function () {
            var newData = _this.instance.getData();
            if (event.name === 'change') {
                _this.change.emit(event);
            }
            else if (event.name === 'dataReady') {
                _this.dataReady.emit(event);
            }
            if (newData === _this.data) {
                return;
            }
            _this._data = newData;
            _this.dataChange.emit(newData);
            if (_this.onChange) {
                _this.onChange(newData);
            }
        });
    };
    CKEditorComponent.prototype.ensureDivareaPlugin = function (config) {
        var extraPlugins = config.extraPlugins, removePlugins = config.removePlugins;
        extraPlugins = this.removePlugin(extraPlugins, 'divarea') || '';
        extraPlugins = extraPlugins.concat(typeof extraPlugins === 'string' ? ',divarea' : 'divarea');
        if (removePlugins && removePlugins.includes('divarea')) {
            removePlugins = this.removePlugin(removePlugins, 'divarea');
            console.warn('[CKEDITOR] divarea plugin is required to initialize editor using Angular integration.');
        }
        return Object.assign({}, config, { extraPlugins: extraPlugins, removePlugins: removePlugins });
    };
    CKEditorComponent.prototype.removePlugin = function (plugins, toRemove) {
        if (!plugins) {
            return null;
        }
        var isString = typeof plugins === 'string';
        if (isString) {
            plugins = plugins.split(',');
        }
        plugins = plugins.filter(function (plugin) { return plugin !== toRemove; });
        if (isString) {
            plugins = plugins.join(',');
        }
        return plugins;
    };
    var CKEditorComponent_1;
    CKEditorComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone }
    ]; };
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
                    useExisting: forwardRef(function () { return CKEditorComponent_1; }),
                    multi: true,
                }
            ]
        })
    ], CKEditorComponent);
    return CKEditorComponent;
}());
export { CKEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tlZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2tlZGl0b3I0LWFuZ3VsYXIvIiwic291cmNlcyI6WyJja2VkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsYUFBYSxFQUFFLFNBQVMsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUVOLGlCQUFpQixFQUNqQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBa0J4RDtJQW1OQywyQkFBcUIsVUFBc0IsRUFBVSxNQUFjO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBM01uRTs7OztXQUlHO1FBQ00sWUFBTyxHQUFHLFVBQVUsQ0FBQztRQUU5Qjs7Ozs7Ozs7O1dBU0c7UUFDTSxTQUFJLDJCQUFzRDtRQW9EbkU7Ozs7V0FJRztRQUNPLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUUxRDs7Ozs7V0FLRztRQUNPLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUU5RDs7Ozs7O1dBTUc7UUFDTyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFM0Q7Ozs7O1dBS0c7UUFDTyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFL0Q7Ozs7V0FJRztRQUNPLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztRQUU5RDs7OztXQUlHO1FBQ08sWUFBTyxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBRTVEOzs7O1dBSUc7UUFDTyxTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFFekQ7Ozs7V0FJRztR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RTt3REFBcUQ7SUFPcEQ7UUFBVCxNQUFNLEVBQUU7c0RBQW1EO0lBT2xEO1FBQVQsTUFBTSxFQUFFO21EQUFnRDtJQU8vQztRQUFULE1BQU0sRUFBRTtpRUFBOEQ7SUFPN0Q7UUFBVCxNQUFNLEVBQUU7Z0VBQTZEO0lBTzVEO1FBQVQsTUFBTSxFQUFFO29EQUFpRDtJQVFoRDtRQUFULE1BQU0sRUFBRTtvREFBaUQ7SUFPaEQ7UUFBVCxNQUFNLEVBQUU7eURBQXNEO0lBT3JEO1FBQVQsTUFBTSxFQUFFO21EQUFnRDtJQXNDaEQ7UUFBUixLQUFLLEVBQUU7d0RBQXdFO0lBak5wRSxpQkFBaUI7UUFaN0IsU0FBUyxDQUFFO1lBQ1gsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLDZCQUE2QjtZQUV2QyxTQUFTLEVBQUU7Z0JBQ1Y7b0JBQ0MsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBRSxjQUFNLE9BQUEsbUJBQWlCLEVBQWpCLENBQWlCLENBQUU7b0JBQ2xELEtBQUssRUFBRSxJQUFJO2lCQUNYO2FBQ0Q7U0FDRCxDQUFFO09BQ1UsaUJBQWlCLENBc2E3QjtJQUFELHdCQUFDO0NBQUEsQUF0YUQsSUFzYUM7U0F0YVksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBDb3B5cmlnaHQgKGMpIDIwMDMtMjAyMCwgQ0tTb3VyY2UgLSBGcmVkZXJpY28gS25hYmJlbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIEZvciBsaWNlbnNpbmcsIHNlZSBMSUNFTlNFLm1kLlxuICovXG5cbmltcG9ydCB7XG5cdENvbXBvbmVudCxcblx0Tmdab25lLFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRFdmVudEVtaXR0ZXIsXG5cdGZvcndhcmRSZWYsXG5cdEVsZW1lbnRSZWYsXG5cdEFmdGVyVmlld0luaXQsIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcblx0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG5cdE5HX1ZBTFVFX0FDQ0VTU09SXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgZ2V0RWRpdG9yTmFtZXNwYWNlIH0gZnJvbSAnLi9ja2VkaXRvci5oZWxwZXJzJztcblxuaW1wb3J0IHsgQ0tFZGl0b3I0IH0gZnJvbSAnLi9ja2VkaXRvcic7XG5cbmRlY2xhcmUgbGV0IENLRURJVE9SOiBhbnk7XG5cbkBDb21wb25lbnQoIHtcblx0c2VsZWN0b3I6ICdja2VkaXRvcicsXG5cdHRlbXBsYXRlOiAnPG5nLXRlbXBsYXRlPjwvbmctdGVtcGxhdGU+JyxcblxuXHRwcm92aWRlcnM6IFtcblx0XHR7XG5cdFx0XHRwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCAoKSA9PiBDS0VkaXRvckNvbXBvbmVudCApLFxuXHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0fVxuXHRdXG59IClcbmV4cG9ydCBjbGFzcyBDS0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXHQvKipcblx0ICogVGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGVkaXRvci5cblx0ICogU2VlIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfY29uZmlnLmh0bWxcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIGNvbmZpZz86IENLRWRpdG9yNC5Db25maWc7XG5cblx0LyoqXG5cdCAqIFRhZyBuYW1lIG9mIHRoZSBlZGl0b3IgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBUaGUgZGVmYXVsdCB0YWcgaXMgYHRleHRhcmVhYC5cblx0ICovXG5cdEBJbnB1dCgpIHRhZ05hbWUgPSAndGV4dGFyZWEnO1xuXG5cdC8qKlxuXHQgKiBUaGUgdHlwZSBvZiB0aGUgZWRpdG9yIGludGVyZmFjZS5cblx0ICpcblx0ICogQnkgZGVmYXVsdCBlZGl0b3IgaW50ZXJmYWNlIHdpbGwgYmUgaW5pdGlhbGl6ZWQgYXMgYGRpdmFyZWFgIGVkaXRvciB3aGljaCBpcyBhbiBpbmxpbmUgZWRpdG9yIHdpdGggZml4ZWQgVUkuXG5cdCAqIFlvdSBjYW4gY2hhbmdlIGludGVyZmFjZSB0eXBlIGJ5IGNob29zaW5nIGJldHdlZW4gYGRpdmFyZWFgIGFuZCBgaW5saW5lYCBlZGl0b3IgaW50ZXJmYWNlIHR5cGVzLlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2d1aWRlL2Rldl91aXR5cGVzLmh0bWxcblx0ICogYW5kIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9leGFtcGxlcy9maXhlZHVpLmh0bWxcblx0ICogdG8gbGVhcm4gbW9yZS5cblx0ICovXG5cdEBJbnB1dCgpIHR5cGU6IENLRWRpdG9yNC5FZGl0b3JUeXBlID0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuQ0xBU1NJQztcblxuXHQvKipcblx0ICogS2VlcHMgdHJhY2sgb2YgdGhlIGVkaXRvcidzIGRhdGEuXG5cdCAqXG5cdCAqIEl0J3MgYWxzbyBkZWNvcmF0ZWQgYXMgYW4gaW5wdXQgd2hpY2ggaXMgdXNlZnVsIHdoZW4gbm90IHVzaW5nIHRoZSBuZ01vZGVsLlxuXHQgKlxuXHQgKiBTZWUgaHR0cHM6Ly9hbmd1bGFyLmlvL2FwaS9mb3Jtcy9OZ01vZGVsIHRvIGxlYXJuIG1vcmUuXG5cdCAqL1xuXHRASW5wdXQoKSBzZXQgZGF0YSggZGF0YTogc3RyaW5nICkge1xuXHRcdGlmICggZGF0YSA9PT0gdGhpcy5fZGF0YSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UgKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlLnNldERhdGEoIGRhdGEgKTtcblx0XHRcdC8vIERhdGEgbWF5IGJlIGNoYW5nZWQgYnkgQUNGLlxuXHRcdFx0dGhpcy5fZGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX2RhdGEgPSBkYXRhO1xuXG5cdH1cblxuXHRnZXQgZGF0YSgpOiBzdHJpbmcge1xuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gc2V0IGB0cnVlYCwgdGhlIGVkaXRvciBiZWNvbWVzIHJlYWQtb25seS5cblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNwcm9wZXJ0eS1yZWFkT25seVxuXHQgKiB0byBsZWFybiBtb3JlLlxuXHQgKi9cblx0QElucHV0KCkgc2V0IHJlYWRPbmx5KCBpc1JlYWRPbmx5OiBib29sZWFuICkge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHRoaXMuaW5zdGFuY2Uuc2V0UmVhZE9ubHkoIGlzUmVhZE9ubHkgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEZWxheSBzZXR0aW5nIHJlYWQtb25seSBzdGF0ZSB1bnRpbCBlZGl0b3IgaW5pdGlhbGl6YXRpb24uXG5cdFx0dGhpcy5fcmVhZE9ubHkgPSBpc1JlYWRPbmx5O1xuXHR9XG5cblx0Z2V0IHJlYWRPbmx5KCk6IGJvb2xlYW4ge1xuXHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdHJldHVybiB0aGlzLmluc3RhbmNlLnJlYWRPbmx5O1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9yZWFkT25seTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgaXMgcmVhZHkuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjaW5zdGFuY2VSZWFkeWBcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNldmVudC1pbnN0YW5jZVJlYWR5XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIHJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0b3IgZGF0YSBpcyBsb2FkZWQsIGUuZy4gYWZ0ZXIgY2FsbGluZyBzZXREYXRhKClcblx0ICogaHR0cHM6Ly9ja2VkaXRvci5jb20vZG9jcy9ja2VkaXRvcjQvbGF0ZXN0L2FwaS9DS0VESVRPUl9lZGl0b3IuaHRtbCNtZXRob2Qtc2V0RGF0YVxuXHQgKiBlZGl0b3IncyBtZXRob2QuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZGF0YVJlYWR5YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRhdGFSZWFkeSBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhUmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGVkaXRvciBoYXMgY2hhbmdlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNjaGFuZ2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtY2hhbmdlXG5cdCAqIGV2ZW50LiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB0aGlzIGV2ZW50IG1heSBiZSBjYWxsZWQgZXZlbiB3aGVuIGRhdGEgZGlkbid0IHJlYWxseSBjaGFuZ2VkLlxuXHQgKiBQbGVhc2Ugbm90ZSB0aGF0IHRoaXMgZXZlbnQgd2lsbCBvbmx5IGJlIGZpcmVkIHdoZW4gYHVuZG9gIHBsdWdpbiBpcyBsb2FkZWQuIElmIHlvdSBuZWVkIHRvXG5cdCAqIGxpc3RlbiBmb3IgZWRpdG9yIGNoYW5nZXMgKGUuZy4gZm9yIHR3by13YXkgZGF0YSBiaW5kaW5nKSwgdXNlIGBkYXRhQ2hhbmdlYCBldmVudCBpbnN0ZWFkLlxuXHQgKi9cblx0QE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGhhcyBjaGFuZ2VkLiBJbiBjb250cmFzdCB0byBgY2hhbmdlYCAtIG9ubHkgZW1pdHMgd2hlblxuXHQgKiBkYXRhIHJlYWxseSBjaGFuZ2VkIHRodXMgY2FuIGJlIHN1Y2Nlc3NmdWxseSB1c2VkIHdpdGggYFtkYXRhXWAgYW5kIHR3byB3YXkgYFsoZGF0YSldYCBiaW5kaW5nLlxuXHQgKlxuXHQgKiBTZWUgbW9yZTogaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL3RlbXBsYXRlLXN5bnRheCN0d28td2F5LWJpbmRpbmctLS1cblx0ICovXG5cdEBPdXRwdXQoKSBkYXRhQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBuYXRpdmUgZHJvcCBldmVudCBvY2N1cnMuIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjZHJhZ3N0YXJ0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdzdGFydFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIHdoZW4gdGhlIG5hdGl2ZSBkcm9wIGV2ZW50IG9jY3Vycy4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNkcmFnZW5kYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWRyYWdlbmRcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgZHJhZ0VuZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgbmF0aXZlIGRyb3AgZXZlbnQgb2NjdXJzLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2Ryb3BgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZHJvcFxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBkcm9wID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBmaWxlIGxvYWRlciByZXNwb25zZSBpcyByZWNlaXZlZC4gSXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgYGVkaXRvciNmaWxlVXBsb2FkUmVzcG9uc2VgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtZmlsZVVwbG9hZFJlc3BvbnNlXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXNwb25zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q0tFZGl0b3I0LkV2ZW50SW5mbz4oKTtcblxuXHQvKipcblx0ICogRmlyZXMgd2hlbiB0aGUgZmlsZSBsb2FkZXIgc2hvdWxkIHNlbmQgWEhSLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZpbGVVcGxvYWRSZXF1ZXN0YFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZpbGVVcGxvYWRSZXF1ZXN0XG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZpbGVVcGxvYWRSZXF1ZXN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIHZpZXcgb2YgdGhlIGVkaXRvciBpcyBmb2N1c2VkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2ZvY3VzYFxuXHQgKiBodHRwczovL2NrZWRpdG9yLmNvbS9kb2NzL2NrZWRpdG9yNC9sYXRlc3QvYXBpL0NLRURJVE9SX2VkaXRvci5odG1sI2V2ZW50LWZvY3VzXG5cdCAqIGV2ZW50LlxuXHQgKi9cblx0QE91dHB1dCgpIGZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyBhZnRlciB0aGUgdXNlciBpbml0aWF0ZWQgYSBwYXN0ZSBhY3Rpb24sIGJ1dCBiZWZvcmUgdGhlIGRhdGEgaXMgaW5zZXJ0ZWQuXG5cdCAqIEl0IGNvcnJlc3BvbmRzIHdpdGggdGhlIGBlZGl0b3IjcGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtcGFzdGVcblx0ICogZXZlbnQuXG5cdCAqL1xuXHRAT3V0cHV0KCkgcGFzdGUgPSBuZXcgRXZlbnRFbWl0dGVyPENLRWRpdG9yNC5FdmVudEluZm8+KCk7XG5cblx0LyoqXG5cdCAqIEZpcmVzIGFmdGVyIHRoZSBgcGFzdGVgIGV2ZW50IGlmIGNvbnRlbnQgd2FzIG1vZGlmaWVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2FmdGVyUGFzdGVgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYWZ0ZXJQYXN0ZVxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBhZnRlclBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBGaXJlcyB3aGVuIHRoZSBlZGl0aW5nIHZpZXcgb2YgdGhlIGVkaXRvciBpcyBibHVycmVkLiBJdCBjb3JyZXNwb25kcyB3aXRoIHRoZSBgZWRpdG9yI2JsdXJgXG5cdCAqIGh0dHBzOi8vY2tlZGl0b3IuY29tL2RvY3MvY2tlZGl0b3I0L2xhdGVzdC9hcGkvQ0tFRElUT1JfZWRpdG9yLmh0bWwjZXZlbnQtYmx1clxuXHQgKiBldmVudC5cblx0ICovXG5cdEBPdXRwdXQoKSBibHVyID0gbmV3IEV2ZW50RW1pdHRlcjxDS0VkaXRvcjQuRXZlbnRJbmZvPigpO1xuXG5cdC8qKlxuXHQgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGVkaXRvciBjcmVhdGVkIGJ5IHRoaXMgY29tcG9uZW50LlxuXHQgKi9cblx0aW5zdGFuY2U6IGFueTtcblxuXHQvKipcblx0ICogSWYgdGhlIGNvbXBvbmVudCBpcyByZWFk4oCTb25seSBiZWZvcmUgdGhlIGVkaXRvciBpbnN0YW5jZSBpcyBjcmVhdGVkLCBpdCByZW1lbWJlcnMgdGhhdCBzdGF0ZSxcblx0ICogc28gdGhlIGVkaXRvciBjYW4gYmVjb21lIHJlYWTigJNvbmx5IG9uY2UgaXQgaXMgcmVhZHkuXG5cdCAqL1xuXHRwcml2YXRlIF9yZWFkT25seTogYm9vbGVhbiA9IG51bGw7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgY29udGVudCBvZiB0aGUgZWRpdG9yIGNoYW5nZXMuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25DaGFuZ2U/OiAoIGRhdGE6IHN0cmluZyApID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgZXhlY3V0ZWQgd2hlbiB0aGUgZWRpdG9yIGhhcyBiZWVuIGJsdXJyZWQuIFBhcnQgb2YgdGhlXG5cdCAqIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgKGh0dHBzOi8vYW5ndWxhci5pby9hcGkvZm9ybXMvQ29udHJvbFZhbHVlQWNjZXNzb3IpIGludGVyZmFjZS5cblx0ICpcblx0ICogTm90ZTogVW5zZXQgdW5sZXNzIHRoZSBjb21wb25lbnQgdXNlcyB0aGUgYG5nTW9kZWxgLlxuXHQgKi9cblx0b25Ub3VjaGVkPzogKCkgPT4gdm9pZDtcblxuXHRwcml2YXRlIF9kYXRhOiBzdHJpbmcgPSBudWxsO1xuXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBDS0VkaXRvciA0IHNjcmlwdCB1cmwgYWRkcmVzcy4gU2NyaXB0IHdpbGwgYmUgbG9hZGVkIG9ubHkgaWYgQ0tFRElUT1IgbmFtZXNwYWNlIGlzIG1pc3NpbmcuXG5cdCAqXG5cdCAqIERlZmF1bHRzIHRvICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4xNS4wL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcydcblx0ICovXG5cdEBJbnB1dCgpIGVkaXRvclVybCA9ICdodHRwczovL2Nkbi5ja2VkaXRvci5jb20vNC4xNS4wL3N0YW5kYXJkLWFsbC9ja2VkaXRvci5qcyc7XG5cblx0Y29uc3RydWN0b3IoIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSApIHtcblx0fVxuXG5cdG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcblx0XHRnZXRFZGl0b3JOYW1lc3BhY2UoIHRoaXMuZWRpdG9yVXJsICkudGhlbiggKCkgPT4ge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgY29tcG9uZW50IGluc3RhbmNlIHdhcyBkZXN0cm95ZWQgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGwgKCMxMTApLlxuXHRcdFx0Ly8gSGVyZSwgYHRoaXMuaW5zdGFuY2VgIGlzIHN0aWxsIG5vdCBpbml0aWFsaXplZCBhbmQgc28gYWRkaXRpb25hbCBmbGFnIGlzIG5lZWRlZC5cblx0XHRcdGlmICggdGhpcy5fZGVzdHJveWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCB0aGlzLmNyZWF0ZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0XHR9ICkuY2F0Y2goIHdpbmRvdy5jb25zb2xlLmVycm9yICk7XG5cdH1cblxuXHRuZ09uRGVzdHJveSgpOiB2b2lkIHtcblx0XHR0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xuXG5cdFx0dGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoICgpID0+IHtcblx0XHRcdGlmICggdGhpcy5pbnN0YW5jZSApIHtcblx0XHRcdFx0dGhpcy5pbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHdyaXRlVmFsdWUoIHZhbHVlOiBzdHJpbmcgKTogdm9pZCB7XG5cdFx0dGhpcy5kYXRhID0gdmFsdWU7XG5cdH1cblxuXHRyZWdpc3Rlck9uQ2hhbmdlKCBjYWxsYmFjazogKCBkYXRhOiBzdHJpbmcgKSA9PiB2b2lkICk6IHZvaWQge1xuXHRcdHRoaXMub25DaGFuZ2UgPSBjYWxsYmFjaztcblx0fVxuXG5cdHJlZ2lzdGVyT25Ub3VjaGVkKCBjYWxsYmFjazogKCkgPT4gdm9pZCApOiB2b2lkIHtcblx0XHR0aGlzLm9uVG91Y2hlZCA9IGNhbGxiYWNrO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVFZGl0b3IoKTogdm9pZCB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRoaXMudGFnTmFtZSApO1xuXHRcdHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XG5cblx0XHRpZiAoIHRoaXMudHlwZSA9PT0gQ0tFZGl0b3I0LkVkaXRvclR5cGUuRElWQVJFQSApIHtcblx0XHRcdHRoaXMuY29uZmlnID0gdGhpcy5lbnN1cmVEaXZhcmVhUGx1Z2luKCB0aGlzLmNvbmZpZyB8fCB7fSApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGluc3RhbmNlOiBDS0VkaXRvcjQuRWRpdG9yID0gdGhpcy50eXBlID09PSBDS0VkaXRvcjQuRWRpdG9yVHlwZS5JTkxJTkVcblx0XHRcdD8gQ0tFRElUT1IuaW5saW5lKCBlbGVtZW50LCB0aGlzLmNvbmZpZyApXG5cdFx0XHQ6IENLRURJVE9SLnJlcGxhY2UoIGVsZW1lbnQsIHRoaXMuY29uZmlnICk7XG5cblx0XHRpbnN0YW5jZS5vbmNlKCAnaW5zdGFuY2VSZWFkeScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG5cblx0XHRcdC8vIFJlYWQgb25seSBzdGF0ZSBtYXkgY2hhbmdlIGR1cmluZyBpbnN0YW5jZSBpbml0aWFsaXphdGlvbi5cblx0XHRcdHRoaXMucmVhZE9ubHkgPSB0aGlzLl9yZWFkT25seSAhPT0gbnVsbCA/IHRoaXMuX3JlYWRPbmx5IDogdGhpcy5pbnN0YW5jZS5yZWFkT25seTtcblxuXHRcdFx0dGhpcy5zdWJzY3JpYmUoIHRoaXMuaW5zdGFuY2UgKTtcblxuXHRcdFx0Y29uc3QgdW5kbyA9IGluc3RhbmNlLnVuZG9NYW5hZ2VyO1xuXG5cdFx0XHRpZiAoIHRoaXMuZGF0YSAhPT0gbnVsbCApIHtcblx0XHRcdFx0dW5kbyAmJiB1bmRvLmxvY2soKTtcblxuXHRcdFx0XHRpbnN0YW5jZS5zZXREYXRhKCB0aGlzLmRhdGEsIHsgY2FsbGJhY2s6ICgpID0+IHtcblx0XHRcdFx0XHQvLyBMb2NraW5nIHVuZG9NYW5hZ2VyIHByZXZlbnRzICdjaGFuZ2UnIGV2ZW50LlxuXHRcdFx0XHRcdC8vIFRyaWdnZXIgaXQgbWFudWFsbHkgdG8gdXBkYXRlZCBib3VuZCBkYXRhLlxuXHRcdFx0XHRcdGlmICggdGhpcy5kYXRhICE9PSBpbnN0YW5jZS5nZXREYXRhKCkgKSB7XG5cdFx0XHRcdFx0XHR1bmRvID8gaW5zdGFuY2UuZmlyZSggJ2NoYW5nZScgKSA6IGluc3RhbmNlLmZpcmUoICdkYXRhUmVhZHknICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVuZG8gJiYgdW5kby51bmxvY2soKTtcblxuXHRcdFx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gfSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5yZWFkeS5lbWl0KCBldnQgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHByaXZhdGUgc3Vic2NyaWJlKCBlZGl0b3I6IGFueSApOiB2b2lkIHtcblx0XHRlZGl0b3Iub24oICdmb2N1cycsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5mb2N1cy5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdwYXN0ZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5wYXN0ZS5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdhZnRlclBhc3RlJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmFmdGVyUGFzdGUuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJhZ2VuZCcsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0dGhpcy5kcmFnRW5kLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0pO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZHJhZ3N0YXJ0JywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRyYWdTdGFydC5lbWl0KCBldnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRlZGl0b3Iub24oICdkcm9wJywgZXZ0ID0+IHtcblx0XHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRyb3AuZW1pdCggZXZ0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnZmlsZVVwbG9hZFJlcXVlc3QnLCBldnQgPT4ge1xuXHRcdFx0dGhpcy5uZ1pvbmUucnVuKCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuZmlsZVVwbG9hZFJlcXVlc3QuZW1pdChldnQpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2ZpbGVVcGxvYWRSZXNwb25zZScsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmZpbGVVcGxvYWRSZXNwb25zZS5lbWl0KGV2dCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0ZWRpdG9yLm9uKCAnYmx1cicsIGV2dCA9PiB7XG5cdFx0XHR0aGlzLm5nWm9uZS5ydW4oICgpID0+IHtcblx0XHRcdFx0aWYgKCB0aGlzLm9uVG91Y2hlZCApIHtcblx0XHRcdFx0XHR0aGlzLm9uVG91Y2hlZCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5ibHVyLmVtaXQoIGV2dCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGVkaXRvci5vbiggJ2RhdGFSZWFkeScsIHRoaXMucHJvcGFnYXRlQ2hhbmdlLCB0aGlzICk7XG5cblx0XHRpZiAoIHRoaXMuaW5zdGFuY2UudW5kb01hbmFnZXIgKSB7XG5cdFx0XHRlZGl0b3Iub24oICdjaGFuZ2UnLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0XHQvLyBJZiAndW5kbycgcGx1Z2luIGlzIG5vdCBsb2FkZWQsIGxpc3RlbiB0byAnc2VsZWN0aW9uQ2hlY2snIGV2ZW50IGluc3RlYWQuICgjNTQpLlxuXHRcdGVsc2Uge1xuXHRcdFx0ZWRpdG9yLm9uKCAnc2VsZWN0aW9uQ2hlY2snLCB0aGlzLnByb3BhZ2F0ZUNoYW5nZSwgdGhpcyApO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcHJvcGFnYXRlQ2hhbmdlKCBldmVudDogYW55ICk6IHZvaWQge1xuXHRcdHRoaXMubmdab25lLnJ1biggKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3RGF0YSA9IHRoaXMuaW5zdGFuY2UuZ2V0RGF0YSgpO1xuXG5cdFx0XHRpZiAoIGV2ZW50Lm5hbWUgPT09ICdjaGFuZ2UnICkge1xuXHRcdFx0XHR0aGlzLmNoYW5nZS5lbWl0KCBldmVudCApO1xuXHRcdFx0fSBlbHNlIGlmICggZXZlbnQubmFtZSA9PT0gJ2RhdGFSZWFkeScgKSB7XG5cdFx0XHRcdHRoaXMuZGF0YVJlYWR5LmVtaXQoIGV2ZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbmV3RGF0YSA9PT0gdGhpcy5kYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2RhdGEgPSBuZXdEYXRhO1xuXHRcdFx0dGhpcy5kYXRhQ2hhbmdlLmVtaXQoIG5ld0RhdGEgKTtcblxuXHRcdFx0aWYgKCB0aGlzLm9uQ2hhbmdlICkge1xuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlKCBuZXdEYXRhICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0cHJpdmF0ZSBlbnN1cmVEaXZhcmVhUGx1Z2luKCBjb25maWc6IENLRWRpdG9yNC5Db25maWcgKTogQ0tFZGl0b3I0LkNvbmZpZyB7XG5cdFx0bGV0IHsgZXh0cmFQbHVnaW5zLCByZW1vdmVQbHVnaW5zIH0gPSBjb25maWc7XG5cblx0XHRleHRyYVBsdWdpbnMgPSB0aGlzLnJlbW92ZVBsdWdpbiggZXh0cmFQbHVnaW5zLCAnZGl2YXJlYScgKSB8fCAnJztcblx0XHRleHRyYVBsdWdpbnMgPSBleHRyYVBsdWdpbnMuY29uY2F0KCB0eXBlb2YgZXh0cmFQbHVnaW5zID09PSAnc3RyaW5nJyA/ICcsZGl2YXJlYScgOiAnZGl2YXJlYScgKTtcblxuXHRcdGlmICggcmVtb3ZlUGx1Z2lucyAmJiByZW1vdmVQbHVnaW5zLmluY2x1ZGVzKCAnZGl2YXJlYScgKSApIHtcblxuXHRcdFx0cmVtb3ZlUGx1Z2lucyA9IHRoaXMucmVtb3ZlUGx1Z2luKCByZW1vdmVQbHVnaW5zLCAnZGl2YXJlYScgKTtcblxuXHRcdFx0Y29uc29sZS53YXJuKCAnW0NLRURJVE9SXSBkaXZhcmVhIHBsdWdpbiBpcyByZXF1aXJlZCB0byBpbml0aWFsaXplIGVkaXRvciB1c2luZyBBbmd1bGFyIGludGVncmF0aW9uLicgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbigge30sIGNvbmZpZywgeyBleHRyYVBsdWdpbnMsIHJlbW92ZVBsdWdpbnMgfSApO1xuXHR9XG5cblx0cHJpdmF0ZSByZW1vdmVQbHVnaW4oIHBsdWdpbnM6IHN0cmluZyB8IHN0cmluZ1tdLCB0b1JlbW92ZTogc3RyaW5nICk6IHN0cmluZyB8IHN0cmluZ1tdIHtcblx0XHRpZiAoICFwbHVnaW5zICkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXNTdHJpbmcgPSB0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZyc7XG5cblx0XHRpZiAoIGlzU3RyaW5nICkge1xuXHRcdFx0cGx1Z2lucyA9ICggcGx1Z2lucyBhcyBzdHJpbmcgKS5zcGxpdCggJywnICk7XG5cdFx0fVxuXG5cdFx0cGx1Z2lucyA9ICggcGx1Z2lucyBhcyBzdHJpbmdbXSApLmZpbHRlciggcGx1Z2luID0+IHBsdWdpbiAhPT0gdG9SZW1vdmUgKTtcblxuXHRcdGlmICggaXNTdHJpbmcgKSB7XG5cdFx0XHRwbHVnaW5zID0gKCBwbHVnaW5zIGFzIHN0cmluZ1tdICkuam9pbiggJywnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBsdWdpbnM7XG5cdH1cbn1cbiJdfQ==