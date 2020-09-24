(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('load-script')) :
    typeof define === 'function' && define.amd ? define('ckeditor4-angular', ['exports', '@angular/core', '@angular/common', '@angular/forms', 'load-script'], factory) :
    (global = global || self, factory(global['ckeditor4-angular'] = {}, global.ng.core, global.ng.common, global.ng.forms, global.loadScript));
}(this, (function (exports, core, common, forms, loadScript) { 'use strict';

    loadScript = loadScript && loadScript.hasOwnProperty('default') ? loadScript['default'] : loadScript;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */
    var promise;
    function getEditorNamespace(editorURL) {
        if (editorURL.length < 1) {
            return Promise.reject(new TypeError('CKEditor URL must be a non-empty string.'));
        }
        if ('CKEDITOR' in window) {
            return Promise.resolve(CKEDITOR);
        }
        else if (!promise) {
            promise = new Promise(function (scriptResolve, scriptReject) {
                loadScript(editorURL, function (err) {
                    if (err) {
                        scriptReject(err);
                    }
                    else {
                        scriptResolve(CKEDITOR);
                    }
                    promise = undefined;
                });
            });
        }
        return promise;
    }

    /**
     * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */
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
        var CKEditorComponent_1;
        CKEditorComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.NgZone }
        ]; };
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "config", void 0);
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "tagName", void 0);
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "type", void 0);
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "data", null);
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "readOnly", null);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "ready", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "dataReady", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "change", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "dataChange", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "dragStart", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "dragEnd", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "drop", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "fileUploadResponse", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "fileUploadRequest", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "focus", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "paste", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "afterPaste", void 0);
        __decorate([
            core.Output()
        ], CKEditorComponent.prototype, "blur", void 0);
        __decorate([
            core.Input()
        ], CKEditorComponent.prototype, "editorUrl", void 0);
        CKEditorComponent = CKEditorComponent_1 = __decorate([
            core.Component({
                selector: 'ckeditor',
                template: '<ng-template></ng-template>',
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return CKEditorComponent_1; }),
                        multi: true,
                    }
                ]
            })
        ], CKEditorComponent);
        return CKEditorComponent;
    }());

    /**
     * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */

    /**
     * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
     * For licensing, see LICENSE.md.
     */
    var CKEditorModule = /** @class */ (function () {
        function CKEditorModule() {
        }
        CKEditorModule = __decorate([
            core.NgModule({
                imports: [forms.FormsModule, common.CommonModule],
                declarations: [CKEditorComponent],
                exports: [CKEditorComponent]
            })
        ], CKEditorModule);
        return CKEditorModule;
    }());

    exports.CKEditorComponent = CKEditorComponent;
    exports.CKEditorModule = CKEditorModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ckeditor4-angular.umd.js.map
