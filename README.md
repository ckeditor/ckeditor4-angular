# CKEditor 4 WYSIWYG editor Angular component

Official [CKEditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor Angular component for Angular 2+.

## Documentation

See the [CKEditor 4 Angular Integration](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_angular.html) article.

### Browser support

CKEditor 4 Angular component fully works with all the [supported browsers](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers) except for IE8-10.

## Contributing

Once you have cloned the repository, install dependecies:

```bash
npm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the CKEditor component,
* `./src/app` is a demo application using the component.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build samples

Run `ng build` to build the samples. The build artifacts will be stored in the `samples/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Publishing

To build and publish the package run `npm run publish`. You can also manually build the package with `npm run build-package` which will be stored in `dist/`. Then you can publish it with `npm publish dist/`.

### License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
