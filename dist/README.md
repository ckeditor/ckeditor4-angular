# CKEditor 4 WYSIWYG editor Angular component [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20CKEditor%204%20Angular%20integration&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fckeditor4-angular)

[![npm version](https://badge.fury.io/js/ckeditor4-angular.svg)](https://www.npmjs.com/package/ckeditor4-angular)
[![GitHub tag](https://img.shields.io/github/tag/ckeditor/ckeditor4-angular.svg)](https://github.com/ckeditor/ckeditor4-angular)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ckeditor/ckeditor4-angular/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ckeditor/ckeditor4-angular/tree/master)

[![Join newsletter](https://img.shields.io/badge/join-newsletter-00cc99.svg)](http://eepurl.com/c3zRPr)
[![Follow Twitter](https://img.shields.io/badge/follow-twitter-00cc99.svg)](https://twitter.com/ckeditor)

## ⚠️ CKEditor 4: End of Life and Extended Support Model until Dec 2026

CKEditor 4 was launched in 2012 and reached its End of Life (EOL) on June 30, 2023.

A special edition, **[CKEditor 4 LTS](https://ckeditor.com/ckeditor-4-support/)** ("Long Term Support"), is available under commercial terms (["Extended Support Model"](https://ckeditor.com/ckeditor-4-support/)) for anyone looking to **extend the coverage of security updates and critical bug fixes**.

With CKEditor 4 LTS, security updates and critical bug fixes are guaranteed until December 2026.

## About this repository

### Master branch = CKEditor 4 LTS Angular Component

After June 30, 2023 the `master` version of the [LICENSE.md](https://github.com/ckeditor/ckeditor4/blob/master/LICENSE.md) file changed to reflect the license of CKEditor 4 LTS available under the Extended Support Model.

This repository now contains the source code of CKEditor 4 LTS Angular Component that is protected by copyright law.

### Getting CKEditor 4 (Open Source)

You may continue using CKEditor Angular Component 4.0.1 and below under the open source license terms. Please note, however, that the open source version no longer comes with any security updates, so your application will be at risk.

In order to download the open source version of CKEditor 4 Angular Component, use ****tags 4.0.1 and below****. CKEditor Angular Component 4.0.1 was the last version available under the open source license terms.

## About this package

Official [CKEditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor component for Angular.

We are looking forward to your feedback! You can report any issues, ideas or feature requests on the [integration issues page](https://github.com/ckeditor/ckeditor4-angular/issues/new).

![CKEditor 4 screenshot](https://c.cksource.com/a/1/img/npm/ckeditor4.png)

## Usage

In order to create an editor instance in Angular, install the `ckeditor4-angular` npm package as a dependency of your project:

```bash
npm install --save ckeditor4-angular
```

After installing, import `CKEditorModule` to your application:

```js
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule( {
    imports: [
        ...
        CKEditorModule,
        ...
    ],
    …
} )
```

You can now use the `<ckeditor>` tag in the component template to include the rich text editor:

```html
<ckeditor data="<p>Hello, world!</p>"></ckeditor>
```

The `data` attribute used in the example above is responsible for setting the editor’s data.

## Documentation and examples

See the [CKEditor 4 Angular Integration](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html) article and [Angular examples](https://ckeditor.com/docs/ckeditor4/latest/examples/angular.html) in the [CKEditor 4 documentation](https://ckeditor.com/docs/ckeditor4/latest/).

## Browser support

The CKEditor 4 Angular component works with all the [supported browsers](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers) except for Internet Explorer 8-11.

## Supported Angular versions

The integration can be used together with Angular at version 5.0.0 and higher. It is an implication of Angular metadata produced for this package by the Angular builder. Note that the `package.json` used in the main repository isn't published on NPM (the production one is present in `src/ckeditor/package.json`), so there are only a few peer dependencies:

* `@angular/core` >= 5.0.0
* `@angular/common` >= 5.0.0
* `@angular/forms` >= 5.0.0

required by this package.

## Contributing

Here is how you can contribute to the development of the component. Any feedback and help will be most appreciated!

### Reporting issues and feature requests

All issues and feature requests should be reported in the [issues section](https://github.com/ckeditor/ckeditor4-angular/issues/new) of the official GitHub repository for the CKEditor 4 Angular integration.

### Development

Clone the [CKEditor 4 Angular integration repository](https://github.com/ckeditor/ckeditor4-angular).

Once you have cloned it, install dependencies by running:

```bash
npm install
```

#### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the CKEditor component,
* `./src/app` is a demo application using the component.

#### Development server

Run `ng serve` to start the development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Building samples

Run `ng build` to build the samples. The build artifacts will be stored in the `samples/` directory.

#### Running unit tests

Run `npm test` to execute unit tests via [Karma](https://karma-runner.github.io).

There are two options available to alternate the testing process:

* `url` / `u` - pass custom URL to Karma, for example custom CKEditor 4 build.
* `watch` / `w` - tell Karma to watch for changes.

For example:

```
npm run test -- -u http://localhost:5000/ckeditor.js -w
```

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](https://www.protractortest.org/).

#### Publishing

To build and publish the package, run `npm run publish`.

You can also manually build the package with `npm run build-package` which will be stored in `dist/`. Then you can publish it with `npm publish dist/`.

## License

Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.

For full details about the license, please check the `LICENSE.md` file.

### CKEditor 4 Angular Component 4.0.1 and below for CKEditor 4 Open Source

Licensed under the terms of any of the following licenses at your choice:

* [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html),
* [GNU Lesser General Public License Version 2.1 or later](http://www.gnu.org/licenses/lgpl.html),
* [Mozilla Public License Version 1.1 or later (the "MPL")](http://www.mozilla.org/MPL/MPL-1.1.html).

### CKEditor 4 Angular Component 5.0 and above for CKEditor 4 LTS ("Long Term Support")

CKEditor 4 LTS Angular Component (starting from version 5.0) is available under a commercial license only.
