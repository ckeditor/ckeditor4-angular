# CKEditor 4 WYSIWYG editor Angular component

[![npm version](https://badge.fury.io/js/ckeditor4-angular.svg)](https://www.npmjs.com/package/ckeditor4-angular)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor4-angular.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor4-angular)
<br>
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor4-angular/status.svg)](https://david-dm.org/ckeditor/ckeditor4-angular)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor4-angular/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor4-angular?type=dev)

The official [CKEditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor component for Angular.

This is the beta version of the CKEditor 4 Angular integration. We are looking forward to your feedback! You can report any issues, ideas or feature requests on the [integration issues page](https://github.com/ckeditor/ckeditor4-angular/issues/new).

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

See the [CKEditor 4 Angular Integration](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html) article and [Angular examples](https://ckeditor.com/docs/ckeditor4/latest/examples/angular.html) in the [CKEditor 4 documentation](https://ckeditor.com/docs/ckeditor4/latest).

## Browser support

The CKEditor 4 Angular component works with all the [supported browsers](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers) except for Internet Explorer 8-10.

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

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](https://www.protractortest.org/).

#### Publishing

To build and publish the package, run `npm run publish`.

You can also manually build the package with `npm run build-package` which will be stored in `dist/`. Then you can publish it with `npm publish dist/`.

## License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
