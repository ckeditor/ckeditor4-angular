# CKEditor 4 Angular Integration Changelog

⚠️️️ **CKEditor 4 (the open source edition) is no longer maintained.** ⚠️

If you would like to keep access to future CKEditor 4 security patches, check the [Extended Support Model](https://ckeditor.com/ckeditor-4-support/), which guarantees **security updates and critical bug fixes until December 2028**. Alternatively, [upgrade to CKEditor 5](https://ckeditor.com/docs/ckeditor5/latest/updating/ckeditor4/migration-from-ckeditor-4.html).

## ckeditor4-angular 5.2.0

⚠️️️ CKEditor 4 CDN dependency has been upgraded to the latest secure version. All editor versions below 4.25.0-lts can no longer be considered as secure! ⚠️

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.25.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4250-lts).

## ckeditor4-angular 5.1.0

⚠️️️ CKEditor 4 CDN dependency has been upgraded to the latest secure version. All editor versions below 4.24.0-lts can no longer be considered as secure! ⚠️

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.24.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4240-lts).

## ckeditor4-angular 5.0.0

This release introduces a support for the LTS (”Long Term Support”) version of the editor, available under commercial terms (["Extended Support Model"](https://ckeditor.com/ckeditor-4-support/)).

If you acquired the Extended Support Model for CKEditor 4 LTS, please read [the CKEditor 4 LTS key activation guide.](https://ckeditor.com/docs/ckeditor4/latest/support/licensing/license-key-and-activation.html)

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.23.0-lts](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4230-lts).

## ckeditor4-angular 4.0.0 / 4.0.1

BREAKING CHANGES:

The v4.0.1 release introduces compatibility with Angular v16+. Please note that this version of Angular no longer supports Internet Explorer 11.

If you want to maintain support for IE11 or haven't upgraded to Angular v16 yet, make sure to use the Angular integration in version 3.3.0.

Other Changes:

* [#242](https://github.com/ckeditor/ckeditor4-angular/issues/242): Updated the minimal version of Angular to `^13.4.0` to ensure compatibility with Angular 16+. Thanks to [Moez Mehri](https://github.com/Mooeeezzzz)!
* Updated default CDN CKEditor 4 dependency to [4.22.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4220--4221).

**Note:** Version 4.0.1 includes a patch for the distribution bundle that fixes missing support for Angular v16+ and should be used instead of v4.0.0 if you target a newer version of Angular.

## ckeditor4-angular 3.3.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.21.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4210).

## ckeditor4-angular 3.2.2

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4202).

## ckeditor4-angular 3.2.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4201).

## ckeditor4-angular 3.2.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.20](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-420).

## ckeditor4-angular 3.1.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.19.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4191).

## ckeditor4-angular 3.1.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.19.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4190).

## ckeditor4-angular 3.0.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.18.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4180).

	[Web Spell Checker](https://webspellchecker.com/) ended support for WebSpellChecker Dialog on December 31st, 2021. Therefore, this plugin has been deprecated and removed from the CKEditor 4.18.0 `standard-all` preset.
	We strongly encourage everyone to choose one of the other available spellchecking solutions - [Spell Check As You Type (SCAYT)](https://ckeditor.com/cke4/addon/scayt) or [WProofreader](https://ckeditor.com/cke4/addon/wproofreader).

## ckeditor4-angular 2.4.1

Other Changes:

* Updated year and company name in the license headers.
* Updated default CDN CKEditor 4 dependency to [4.17.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4172).

## ckeditor4-angular 2.4.0

New Features:

* [#190](https://github.com/ckeditor/ckeditor4-angular/issues/190): Added support for CKEditor 4 [Delayed Editor Creation](https://ckeditor.com/docs/ckeditor4/latest/features/delayed_creation.html) feature.

## ckeditor4-angular 2.3.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.17.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4171).

## ckeditor4-angular 2.2.2

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.16.2](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4162).

## ckeditor4-angular 2.2.1

Fixed Issues:

* [#191](https://github.com/ckeditor/ckeditor4-angular/issues/191): Fixed: Cannot find module `ckeditor4-integrations-common` error after upgrading to `2.2.0`.

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.16.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4161).

## ckeditor4-angular 2.2.0

New Features:

* [#143](https://github.com/ckeditor/ckeditor4-angular/issues/143): Exposed `namespaceLoaded` event fired when [`CKEDITOR` namespace](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html) is loaded, which can be used for its easier customization.

## ckeditor4-angular 2.1.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.16.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-416).
* Updated year in license headers.

## ckeditor4-angular 2.0.1

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.15.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4151).

## ckeditor4-angular 2.0.0

Breaking Changes:

* [#130](https://github.com/ckeditor/ckeditor4-angular/issues/130): `DIVAREA` editor type has been deprecated. Use [Div Editing Area](https://ckeditor.com/cke4/addon/divarea) plugin instead (see [migration guide](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html#using-the-div-based-editor-type)).

## ckeditor4-angular 1.3.0

Other Changes:

* Updated default CDN CKEditor 4 dependency to [4.15.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-415).
* [#98](https://github.com/ckeditor/ckeditor4-angular/issues/98): Updated repository dependencies (no changes in the actual `ckeditor4-angular` package).
* [#128](https://github.com/ckeditor/ckeditor4-angular/issues/128): Improve the stability of `getEditorNamespace()` method.

## ckeditor4-angular 1.2.2

Fixed Issues:

* [#110](https://github.com/ckeditor/ckeditor4-angular/issues/110): Fixed: Integration throws an error when CKEditor 4 component is removed from the DOM before CKEditor 4 is loaded. Thanks to [Benjamin Hugot](https://github.com/bhugot)!

## ckeditor4-angular 1.2.1

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.14.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4141).

## ckeditor4-angular 1.2.0

New Features:

* [#7](https://github.com/ckeditor/ckeditor4-angular/issues/7): The CKEditor 4 Angular component now exposes more CKEditor 4 native events. Thanks to [Eduard Zintz](https://github.com/ezintz)! The newly exposed events are:
	* [`paste`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-paste)
	* [`afterPaste`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-afterPaste)
	* [`dragStat`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragstart)
	* [`dragEnd`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-dragend)
	* [`drop`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-drop)
	* [`fileUploadRequest`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadRequest)
	* [`fileUploadResponse`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#event-fileUploadResponse)

## ckeditor4-angular 1.1.0

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.14.0](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-414).

## ckeditor4-angular 1.0.1

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.13.1](https://github.com/ckeditor/ckeditor4/blob/master/CHANGES.md#ckeditor-4131).

## ckeditor4-angular 1.0.0

New Features:

* [#6](https://github.com/ckeditor/ckeditor4-angular/issues/6): Added support for classic (iframe-based) editor. Starting from this version classic editor is used by default.
* [#40](https://github.com/ckeditor/ckeditor4-angular/pull/40): Added support for Angular 5.

Fixed Issues:

* [#42](https://github.com/ckeditor/ckeditor4-angular/issues/42): Fixed: The `elementRef` related error is thrown when using Angular 5.
* [#54](https://github.com/ckeditor/ckeditor4-angular/issues/54): Fixed: Two-way data binding does not work when the [Undo](https://ckeditor.com/cke4/addon/undo) plugin is not present.

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.13.0](https://github.com/ckeditor/ckeditor4-angular/issues/59).

## ckeditor4-angular 1.0.0-beta.2

Other Changes:

* Updated the default CKEditor 4 CDN dependency to [4.12.1](https://github.com/ckeditor/ckeditor4-angular/commit/2bf8a8c489f2a9ea2f2d9304e2e3d92646dbe89e).

## ckeditor4-angular 1.0.0-beta

Other Changes:

* [#28](https://github.com/ckeditor/ckeditor4-angular/issues/28): Updated package dev dependencies.

## ckeditor4-angular 0.1.2

Other Changes:

* [#20](https://github.com/ckeditor/ckeditor4-angular/issues/20): Added the "Quick Start" section to README file.
* [#10](https://github.com/ckeditor/ckeditor4-angular/issues/10): Updated the LICENSE file with all required dependencies.

## ckeditor4-angular 0.1.1

Other Changes:

* `README.md` file improvements.

## ckeditor4-angular 0.1.0

The first beta release of CKEditor 4 WYSIWYG Editor Angular Integration.
