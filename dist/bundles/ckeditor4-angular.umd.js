(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('ckeditor4-integrations-common')) :
    typeof define === 'function' && define.amd ? define('ckeditor4-angular', ['exports', '@angular/core', '@angular/common', '@angular/forms', 'ckeditor4-integrations-common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ckeditor4-angular'] = {}, global.ng.core, global.ng.common, global.ng.forms, global.ckeditor4IntegrationsCommon));
}(this, (function (exports, core, common, forms, ckeditor4IntegrationsCommon) { 'use strict';

    /**
     * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */
    var CKEditorComponent = /** @class */ (function () {
        function CKEditorComponent(elementRef, ngZone) {
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
            this.namespaceLoaded = new core.EventEmitter();
            /**
             * Fires when the editor is ready. It corresponds with the `editor#instanceReady`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-instanceReady
             * event.
             */
            this.ready = new core.EventEmitter();
            /**
             * Fires when the editor data is loaded, e.g. after calling setData()
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData
             * editor's method. It corresponds with the `editor#dataReady`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dataReady event.
             */
            this.dataReady = new core.EventEmitter();
            /**
             * Fires when the content of the editor has changed. It corresponds with the `editor#change`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-change
             * event. For performance reasons this event may be called even when data didn't really changed.
             * Please note that this event will only be fired when `undo` plugin is loaded. If you need to
             * listen for editor changes (e.g. for two-way data binding), use `dataChange` event instead.
             */
            this.change = new core.EventEmitter();
            /**
             * Fires when the content of the editor has changed. In contrast to `change` - only emits when
             * data really changed thus can be successfully used with `[data]` and two way `[(data)]` binding.
             *
             * See more: https://angular.io/guide/template-syntax#two-way-binding---
             */
            this.dataChange = new core.EventEmitter();
            /**
             * Fires when the native dragStart event occurs. It corresponds with the `editor#dragstart`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart
             * event.
             */
            this.dragStart = new core.EventEmitter();
            /**
             * Fires when the native dragEnd event occurs. It corresponds with the `editor#dragend`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend
             * event.
             */
            this.dragEnd = new core.EventEmitter();
            /**
             * Fires when the native drop event occurs. It corresponds with the `editor#drop`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop
             * event.
             */
            this.drop = new core.EventEmitter();
            /**
             * Fires when the file loader response is received. It corresponds with the `editor#fileUploadResponse`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse
             * event.
             */
            this.fileUploadResponse = new core.EventEmitter();
            /**
             * Fires when the file loader should send XHR. It corresponds with the `editor#fileUploadRequest`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest
             * event.
             */
            this.fileUploadRequest = new core.EventEmitter();
            /**
             * Fires when the editing area of the editor is focused. It corresponds with the `editor#focus`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-focus
             * event.
             */
            this.focus = new core.EventEmitter();
            /**
             * Fires after the user initiated a paste action, but before the data is inserted.
             * It corresponds with the `editor#paste`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste
             * event.
             */
            this.paste = new core.EventEmitter();
            /**
             * Fires after the `paste` event if content was modified. It corresponds with the `editor#afterPaste`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste
             * event.
             */
            this.afterPaste = new core.EventEmitter();
            /**
             * Fires when the editing view of the editor is blurred. It corresponds with the `editor#blur`
             * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-blur
             * event.
             */
            this.blur = new core.EventEmitter();
            /**
             * If the component is read–only before the editor instance is created, it remembers that state,
             * so the editor can become read–only once it is ready.
             */
            this._readOnly = null;
            this._data = null;
            this._destroyed = false;
        }
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
            enumerable: false,
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
             * When set to `true`, the editor becomes read-only.
             *
             * See https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#property-readOnly
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
            enumerable: false,
            configurable: true
        });
        CKEditorComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            ckeditor4IntegrationsCommon.getEditorNamespace(this.editorUrl, function (namespace) {
                _this.namespaceLoaded.emit(namespace);
            }).then(function () {
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
        return CKEditorComponent;
    }());
    CKEditorComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ckeditor',
                    template: '<ng-template></ng-template>',
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return CKEditorComponent; }),
                            multi: true,
                        }
                    ]
                },] }
    ];
    CKEditorComponent.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.NgZone }
    ]; };
    CKEditorComponent.propDecorators = {
        config: [{ type: core.Input }],
        editorUrl: [{ type: core.Input }],
        tagName: [{ type: core.Input }],
        type: [{ type: core.Input }],
        data: [{ type: core.Input }],
        readOnly: [{ type: core.Input }],
        namespaceLoaded: [{ type: core.Output }],
        ready: [{ type: core.Output }],
        dataReady: [{ type: core.Output }],
        change: [{ type: core.Output }],
        dataChange: [{ type: core.Output }],
        dragStart: [{ type: core.Output }],
        dragEnd: [{ type: core.Output }],
        drop: [{ type: core.Output }],
        fileUploadResponse: [{ type: core.Output }],
        fileUploadRequest: [{ type: core.Output }],
        focus: [{ type: core.Output }],
        paste: [{ type: core.Output }],
        afterPaste: [{ type: core.Output }],
        blur: [{ type: core.Output }]
    };

    /**
     * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */
    var CKEditorModule = /** @class */ (function () {
        function CKEditorModule() {
        }
        return CKEditorModule;
    }());
    CKEditorModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [forms.FormsModule, common.CommonModule],
                    declarations: [CKEditorComponent],
                    exports: [CKEditorComponent]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CKEditorComponent = CKEditorComponent;
    exports.CKEditorModule = CKEditorModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ckeditor4-angular.umd.js.map
