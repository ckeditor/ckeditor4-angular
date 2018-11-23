# CKEditor 4 WYSIWYG editor Angular component

Official [CKeditor 4](https://ckeditor.com/ckeditor-4/) WYSIWYG editor Angular component for Angular 2+

## Documentation

See [CKEditor 4 Angular component](https://ckeditor.com/docs/ckeditor4/latest/guide/index.html) article.

## Contributing

Once you have cloned the repository install dependecies:

```bash
npm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the CKEditor component,
* `./src/app` is a demo application using the component.

### Development

For development testing you should enable CKEditior4 built version at `http://localhost:1050/apps/ckeditor/ckeditor.js`. The path is specificaly pointing at CKEditor file hosted by our [testing environment (Bender.js)](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_tests.html) used with CKEditor built version which can be generated using [Presets Builder](https://github.com/ckeditor/ckeditor-presets).

The path for served CKEditor files can be changed directly inside `src/karma.conf.js` and `src/index.html` files.

### Production

Production testing should be performed by adding `--prod` flag for Angular CLI. It will include CKEditor into samples and Karma tests using [CKEditor CDN](https://cdn.ckeditor.com/) service.

### Development server

Run `ng serve [--prod]` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build [--prod]` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test [--prod]` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e [--prod]` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### License
Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
